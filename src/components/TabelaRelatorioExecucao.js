import React from 'react';
import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from 'react-table'

function TabelaRelatorioExecucao(props) {

    const data = React.useMemo(
        () => props.dados,
        []
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'Municipio',
                accessor: 'municipio',
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

    const totalExecutado = props.dados.reduce((acc, current) => acc + current.executado, 0);

    const pesquisaGlobal = (e) => {
        setGlobalFilter(e.target.value)
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <form className="controls mb-3">
                    <div className="form-row d-flex justify-content-center">
                        <div className="col-4">
                            <input type="text" className="form-control form-control-sm" onChange={pesquisaGlobal} value={state.globalFilter} placeholder="Pesquisar" />
                        </div>
                    </div>
                </form>
                <div className="alert fz-16 font-weight-bolder alert-warning text-center" role="alert">
                    Total Executado: R$ {totalExecutado.toLocaleString("pt-br")}
                </div>
                <div className="card">
                    <div className="table-responsive">
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
                                                            ? <i className="ni ni-bold-down ml-1"></i>
                                                            : <i className="ni ni-bold-up ml-1"></i>
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

export default TabelaRelatorioExecucao;