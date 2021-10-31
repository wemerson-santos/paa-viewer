import React from 'react';

class FormularioUpload extends React.Component {
    render() {
        return (
            <div className="card mb-3 w-50">
                <div className="card-body">
                    <div className="alert alert-warning text-center" role="alert">
                        Atenção! Agora é possível selecionar todos os arquivos de excel para gerar relatório.
                    </div>
                    <form onSubmit={this.props.onFormSubmit}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <input type="file" name="planilhas" className="form-control" multiple ref={this.planilhaProdutores} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="submit" className="btn btn-primary btn-block">Gerar Relatórios</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormularioUpload;