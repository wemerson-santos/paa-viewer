import React from 'react';

function TabelaRelatorioNegativo(props) {
    return (
        <div>
            {props.dados.map(municipio => {
                return (
                    <div key={municipio.nome} className="card">
                        <div className="table-responsive">
                            <h3 className="text-center mt-2">{municipio.nome}</h3>
                            <table className="table align-items-center table-flush custom-table">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Alimento</th>
                                        <th>Comprado</th>
                                        <th>Doado</th>
                                        <th>Estoque</th>
                                    </tr>
                                </thead>
                                <tbody className="list">
                                    {municipio.alimentos.map(alimento => {
                                        return (
                                            <tr key={alimento.alimento}>
                                                <td>{alimento.alimento}</td>
                                                <td>{alimento.comprado.toLocaleString("pt-br")}</td>
                                                <td>{alimento.doado.toLocaleString("pt-br")}</td>
                                                <td><span className="badge bg-danger custom-badge">{alimento.estoque.toLocaleString("pt-br")}</span></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TabelaRelatorioNegativo;