const React = require('react');

import FileDropzone from './FileDropzone';
import FormElements from './FormElements';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                filename: 'excel-links.xlsx',
                imagePath: 'images'
            },
            files: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFormDataChange(event) {

    }

    handleFilesChange() {

    }

    handleSubmit(event) {
        console.log('SUBMIT', event);
        console.log(this.state);

        event.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-5">
                            <FormElements formData={this.state.formData} />

                            <div className="form-group submit-group">
                                <input type="submit" className="btn btn-primary btn-lg" value="Process" />
                            </div>
                        </div>
                        <div className="col-5">
                            <FileDropzone files={this.state.files} />
                        </div>
                        <div className="col-2">
                            Results
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
