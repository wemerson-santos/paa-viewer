import xlsx from 'xlsx';
import { listaAlimentos } from './listaAlimentos';
import { listaAlteracaoProdutores } from './listaAlteracaoProdutores';

export function carregarPlanilhas(planilhas) {
    const promisesList = [];
    planilhas.forEach(planilha => {
        promisesList.push(new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                resolve(await xlsxParaJson(reader.result));
            };
            reader.readAsArrayBuffer(planilha);
        }))
    })
    return promisesList;
}

function xlsxParaJson(planilha) {
    return new Promise((resolve, reject) => {
        const dadosJson = {};
        const data = new Uint8Array(planilha);
        const workbook = xlsx.read(data, { type: "array" });

        workbook.SheetNames.forEach(function (sheetName) {
            const roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
                header: 1
            });
            if (roa.length) dadosJson[sheetName] = roa;
        });
        resolve(dadosJson)
    })
}

// ----------------------------------------
// Funções para geração tratamento de dados
// ----------------------------------------
function gerarListaExclusiva(dados, indice) {
    const lista = new Set();
    dados.forEach((linha) => {
        lista.add(linha[indice]);
    });
    return [...lista].sort();
}

function selecionarLinhasValidas(dados) {
    return dados.filter(linha => linha[3] === 'MG')
}

function selecionarColunasValidasProdutores(produtores) {
    return produtores.map(produtor => {
        return {
            alimento: produtor[15].replace("(Classificação ", "").trim(),
            quantidade: parseFloat(produtor[40].replace(",", ".")),
            valor: parseFloat(produtor[41].replace(",", ".")),
            cpf: produtor[11].trim(),
            municipio: produtor[8].trim(),
            categoria: 'comprado'
        }
    })
}

function selecionarColunasValidasEntidades(entidades) {
    return entidades.map(entidade => {
        return {
            alimento: entidade[21].replace("(Classificação ", "").trim(),
            quantidade: parseFloat(entidade[34].replace(",", ".")),
            municipio: entidade[8].trim(),
            categoria: 'doado'
        }
    })
}

function alterarMunicipioProdutor(dados) {
    listaAlteracaoProdutores.forEach((produtor) => {
        dados.forEach((linha) => {
            if (linha.cpf === produtor.cpf) {
                linha.municipio = produtor.municipio;
            }
        });
    });
    return dados;
}

function tratarDadosProdutores(dados) {
    // Refatorar para estrutura em pipe
    return alterarMunicipioProdutor(selecionarColunasValidasProdutores(selecionarLinhasValidas(dados)))
}

function tratarDadosEntidades(dados) {
    // Refatorar para estrutura em pipe
    return selecionarColunasValidasEntidades(selecionarLinhasValidas(dados))
}

// ----------------------------------
// Funções para geração de relatórios
// ----------------------------------
export function gerarRelatorios(dados) {
    const produtores = [];
    const entidades = [];

    // Criar validação de entrada de arquivos
    // const arquivos = ['relatorioamploexecucaoentidade', 'relatorioamploexecucaoprodutor']

    dados.forEach(item => {
        if (item['relatorioamploexecucaoentidade']) {
            entidades.push(...item['relatorioamploexecucaoentidade'])
        } else {
            produtores.push(...item['relatorioamploexecucaoprodutor'])
        }
    })

    // Dados Produtores & Entidades
    const dadosProdutores = tratarDadosProdutores(produtores);
    const dadosEntidades = tratarDadosEntidades(entidades);

    return ({
        relatorios: {
            geral: gerarRelatorioGeral(dadosProdutores, dadosEntidades),
            municipal: gerarRelatorioMunicipal(dadosProdutores, dadosEntidades),
            negativo: gerarRelatorioNegativo(dadosProdutores, dadosEntidades),
            execucao: gerarRelatorioExecucao(dadosProdutores, dadosEntidades),
        }
    })
}

function gerarRelatorioGeral(comprado, doado) {
    const relatorio = [];
    listaAlimentos.forEach((alimento) => {
        const item = {
            alimento: alimento,
            comprado: 0,
            doado: 0,
            estoque: 0,
            executado: 0
        };

        const itemRelatorio = [...comprado, ...doado].reduce((acumulado, atual) => {
            if (alimento === atual.alimento) {
                if (atual.categoria === "comprado") {
                    item.comprado += atual.quantidade;
                    item.estoque += atual.quantidade;
                    item.executado += atual.valor;
                } else {
                    item.doado += atual.quantidade;
                    item.estoque -= atual.quantidade;
                }
            }
            return (acumulado = item);
        }, {});
        relatorio.push(itemRelatorio);
    });
    return relatorio;
}

function gerarRelatorioMunicipal(comprado, doado) {
    const listaMunicipios = gerarListaExclusiva(comprado, 'municipio');
    const relatorioMunicipios = [];

    listaMunicipios.forEach((municipio) => {
        relatorioMunicipios.push({
            municipio: municipio,
            alimentos: gerarRelatorioGeral(
                comprado.filter((item) => item.municipio === municipio),
                doado.filter((item) => item.municipio === municipio)
            )
        });
    });
    return relatorioMunicipios;
}

// Possibilita criar dois tipos de relatórios: Saldo positivo ou negativo
function gerarRelatorioNegativo(comprado, doado) {
    const relatorioMunicipios = gerarRelatorioMunicipal(comprado, doado);
    const relatorio = [];

    relatorioMunicipios.forEach((municipio) => {
        const item = {
            nome: municipio.municipio,
            alimentos: []
        };
        const alimento = municipio.alimentos.reduce((acumulado, atual) => {
            if (atual.estoque.toFixed(2) < 0) {
                item.alimentos.push(atual);
            }
            return (acumulado = item);
        }, {});
        relatorio.push(alimento);
    });

    return relatorio.filter((uni) => uni.alimentos.length > 0);
}

function gerarRelatorioExecucao(comprado, doado) {
    const listaMunicipios = gerarListaExclusiva(comprado, 'municipio');
    const relatorioMunicipios = [];

    listaMunicipios.forEach((municipio) => {
        relatorioMunicipios.push({
            municipio: municipio,
            alimentos: gerarRelatorioGeral(
                comprado.filter((item) => item.municipio === municipio),
                doado.filter((item) => item.municipio === municipio)
            )
        });
    });

    const relatorio = [];

    relatorioMunicipios.forEach((municipio) => {
        const item = {
            municipio: municipio.municipio,
            executado: 0
        };
        const alimento = municipio.alimentos.reduce((acc, current) => {
            item.executado += current.executado;
            return (acc = item);
        }, {});
        relatorio.push(alimento);
    });

    return relatorio;
}


