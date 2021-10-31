import React, { useState } from 'react';
import Switch from "react-switch";
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from 'react-table'

function TabelaRelatorioMunicipal(props) {

    const data = props.dados
    const columns = React.useMemo(
        () => [
            {
                Header: 'Alimento',
                accessor: 'alimento',
            },
            {
                Header: 'Comprado',
                accessor: 'comprado',
                Cell: props => props.value.toLocaleString("pt-br")
            },
            {
                Header: 'Doado',
                accessor: 'doado',
                Cell: props => props.value.toLocaleString("pt-br")
            },
            {
                Header: 'Estoque',
                accessor: 'estoque',
                Cell: props => props.value < 0 ? <span className="badge bg-danger custom-badge">{props.value.toLocaleString("pt-br")}</span> : props.value.toLocaleString("pt-br"),
                filter: (rows) => {
                    return rows.filter(item => item.values.estoque.toLocaleString("pt-br") != 0);
                }
            },
            {
                Header: 'Excecutado',
                accessor: 'executado',
                Cell: props => 'R$ ' + props.value.toLocaleString("pt-br")
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state,
        setFilter,
        setGlobalFilter,
    } = useTable(
        {
            columns, data, initialState: { pageIndex: 0, pageSize: 200 }
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    )

    const [check, setCheck] = useState(false)

    const removerEstoquesNulos = function (e) {
        setCheck(!check)
        e ? setFilter('estoque', true) : setFilter('estoque', undefined)
    }

    const totalComprado = props.dados.reduce((acc, current) => acc += current.comprado, 0);
    const totalDoado = props.dados.reduce((acc, current) => acc + current.doado, 0);
    const totalExecutado = props.dados.reduce((acc, current) => acc + current.executado, 0);
    const diferencaCompradoDoado = totalComprado - totalDoado;

    const aplicarFiltroGlobal = (e) => {
        setGlobalFilter(e.target.value)
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <form className="controls mb-3">
                    <div className="form-row d-flex justify-content-center">
                        <div className="col-3 d-flex align-items-center">
                            <Switch
                                onChange={removerEstoquesNulos}
                                checked={check}
                                handleDiameter={14}
                                height={18}
                                width={40}
                                onColor="#5e72e4"
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                            <span className="fz-14 ml-2">Remover nulos</span>
                        </div>
                        <div className="col-4">
                            <input type="text" className="form-control form-control-sm" onChange={aplicarFiltroGlobal} value={state.globalFilter} placeholder="Pesquisar" />
                        </div>
                    </div>
                </form>
                <div className="card">
                    <div className="table-responsive">
                        <div className="alert fz-16 font-weight-bolder alert-warning text-center" role="alert">
                            Total Executado: R$ {totalExecutado.toLocaleString("pt-br")}
                        </div>
                        <table {...getTableProps()} className="table align-items-center table-flush table-striped table-bordered table-hover custom-table">
                            <thead className="thead-light">
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? <i class="ni ni-bold-down ml-1"></i>
                                                            : <i class="ni ni-bold-up ml-1"></i>
                                                        : ''}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()} className="list">
                                {page.map((row, i) => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>TOTAL</th>
                                    <th>{totalComprado.toLocaleString("pt-br")} Kg</th>
                                    <th>{totalDoado.toLocaleString("pt-br")} Kg</th>
                                    <th>{diferencaCompradoDoado.toLocaleString("pt-br")} Kg</th>
                                    <th>R$ {totalExecutado.toLocaleString("pt-br")}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabelaRelatorioMunicipal;