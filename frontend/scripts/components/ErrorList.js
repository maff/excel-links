import React from 'react';

class ErrorList extends React.Component {
    render() {
        let that = this;

        let errors = this.props.errors.map(function (error, index) {
            return (
                <div className="alert alert-danger alert-dismissible fade show" role="alert" key={index}>
                    <a className="close" onClick={() => that.props.removeError(index)}>
                        <span>&times;</span>
                    </a>
                    <strong>Error:</strong> {error}
                </div>
            );
        });

        return (
            <div className="alert-list">
                {errors}
            </div>
        );
    }
}

export default ErrorList;
