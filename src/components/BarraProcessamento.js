import React from 'react';
import icone from '../assets/img/loading.gif'

class BarraProcessamento extends React.Component {
    render() {
        return (
            <div className="loading-container">
                <img src={icone} alt="Carregando" className="mt-4" />
            </div>
        );
    }
}

export default BarraProcessamento;