import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { carregarPlanilhas, gerarRelatorios } from './utils/funcoesRelatorios'

import FormularioUpload from './components/FormularioUpload';
import BarraProcessamento from './components/BarraProcessamento';

import TabelaRelatorioGeral from './components/TabelaRelatorioGeral';
import RelatorioMunicipal from './components/RelatorioMunicipal';
import TabelaRelatorioNegativo from './components/TabelaRelatorioNegativo';
import TabelaRelatorioExecucao from './components/TabelaRelatorioExecucao';

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            estaProcessando: false,
            relatorios: {
                geral: [],
                municipal: [],
                negativo: [],
                execucao: [],
            }
        }
    }

    enviarFormulario = async (event) => {
        event.preventDefault()
        const planilhas = [...event.target[0].files];

        this.setState({ estaProcessando: true })

        // Necessários para o react conseguir mostrar a barra de processamento. 
        // OBS: Procurar uma alternativa elegante para resolver o problema.
        setTimeout(async () => {
            const dadosBrutos = await Promise.all(carregarPlanilhas(planilhas)).then(result => result)
            this.setState(gerarRelatorios(dadosBrutos))
            this.setState({ estaProcessando: false })
        }, 1000)
    }

    isDataLoaded() {
        return this.state.relatorios.geral.length === 0
    }

    mostrarBarraProcessamento = () => {
        if (this.state.estaProcessando)
            return <BarraProcessamento></BarraProcessamento>
    }

    mostrarTabs() {
        return (
            <Tabs>
                <TabList>
                    <Tab>Relatório Geral</Tab>
                    <Tab>Relatório Municipal</Tab>
                    <Tab>Relatório Negativo</Tab>
                    <Tab>Relatório Execução</Tab>
                </TabList>

                <TabPanel>
                    <TabelaRelatorioGeral dados={this.state.relatorios.geral}></TabelaRelatorioGeral>
                </TabPanel>
                <TabPanel>
                    <RelatorioMunicipal dados={this.state.relatorios.municipal}></RelatorioMunicipal>
                </TabPanel>
                <TabPanel>
                    <TabelaRelatorioNegativo dados={this.state.relatorios.negativo}></TabelaRelatorioNegativo>
                </TabPanel>
                <TabPanel>
                    <TabelaRelatorioExecucao dados={this.state.relatorios.execucao}></TabelaRelatorioExecucao>
                </TabPanel>
            </Tabs>
        )
    }

    mostrarRelatorios() {
        return this.isDataLoaded() ? <FormularioUpload onFormSubmit={this.enviarFormulario} /> : this.mostrarTabs()
    }

    render() {
        return (
            <div className="container-fluid vh-100s mt-6 mb-6 d-flex flex-column justify-content-center align-items-md-center">
                <h1>PAA Viewer</h1>
                {this.mostrarRelatorios()}
                <p className="creditos">Desenvolvido por <a href="https://github.com/wemerson-santos/paa-viewer" target="_blank" rel="noopener noreferrer">Wemerson Santos</a></p>
                {this.mostrarBarraProcessamento()}
            </div>
        );
    }
}

export default App;
