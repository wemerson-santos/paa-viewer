import React, { useState } from 'react';
import TabelaRelatorioMunicipal from './TabelaRelatorioMunicipal';

function RelatorioMunicipal(props) {

    const [relatorio, setRelatorio] = useState([]);
    const filtrarDadosMunicipio = (municipioSelecionado) => {
        return props.dados.filter(item => item.municipio === municipioSelecionado).map(item => item.alimentos)[0]
    }

    const selecionarMunicipio = (event) => {
        const municipioSelecionado = event.target.value;
        setRelatorio(filtrarDadosMunicipio(municipioSelecionado));
    }

    const mostrarListaMunicipios = () => {
        return (
            <select className="form-control form-control-sm" onChange={selecionarMunicipio}>
                <option value="">Selecione município</option>
                {props.dados.map(municipio => {
                    return <option key={municipio.municipio} value={municipio.municipio}>{municipio.municipio}</option>
                })}
            </select>
        )
    }

    const mostrarRelatorioMunicipio = () => {
        return relatorio.length !== 0 ? <TabelaRelatorioMunicipal dados={relatorio}></TabelaRelatorioMunicipal> : ''
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <form className="controls mb-3">
                    {mostrarListaMunicipios()}
                </form>
                {mostrarRelatorioMunicipio()}
            </div >
        </div >
    )
}

export default RelatorioMunicipal;