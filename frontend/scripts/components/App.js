import React from 'react';
import ErrorList from './ErrorList';
import FileDropzone from './FileDropzone';
import FileList from './FileList';
import FormElements from './FormElements';
import DownloadList from './DownloadList';

import axios from 'axios';
import NProgress from 'nprogress';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.buildInitialState();
    }

    buildInitialState() {
        let state = {
            formData: {
                filename: 'excel-links.xlsx',
                imagePath: 'images'
            },
            files: [],
            downloaded: [],
            errors: []
        };

        let saved = JSON.parse(localStorage.getItem('app_state') || '{}');

        if (saved.formData) {
            state.formData = saved.formData;
        }

        if (saved.files) {
            state.files = saved.files;
        }

        this.state = state;
    }

    setState(partialState, callback) {
        super.setState(partialState, callback);

        let saved = {
            formData: this.state.formData,
            files: this.state.files
        };

        localStorage.setItem('app_state', JSON.stringify(saved));
    }

    setFormData(name, value) {
        let formData = this.state.formData;
        formData[name] = value;

        this.setState({formData: formData});
    }

    addFiles(newFiles) {
        let files = this.state.files;

        newFiles.forEach((file) => {
            files.push(file);
        });

        files = [ ...new Set(files) ]; // unique
        files.sort();

        this.setState({files: files});
    }

    handleListRemove(property, index) {
        let state = {};
        state[property] = this.state[property];
        state[property].splice(index, 1);

        this.setState(state);
    }

    handleListClear(property) {
        let state = {};
        state[property] = [];

        this.setState(state);
    }

    removeFile(index) {
        this.handleListRemove('files', index);
    }

    clearFiles() {
        this.handleListClear('files');
    }

    removeDownloadedFile(index) {
        this.handleListRemove('downloaded', index);
    }

    clearDownloadedFiles() {
        this.handleListClear('downloaded');
    }

    addError(error) {
        let errors = this.state.errors;
        errors.push(error);

        this.setState({errors: errors});
    }

    removeError(index) {
        this.handleListRemove('errors', index);
    }

    normalizeFormData() {
        let imagePath = this.state.formData.imagePath;
        imagePath = imagePath.replace(/\\/g, '/');
        imagePath = imagePath.replace(/^\/+/g, '');
        imagePath = imagePath.replace(/\/+$/g, '');

        if (imagePath) {
            imagePath = imagePath + '/';
        }

        this.state.formData.imagePath = imagePath;

        this.setState({formData: this.state.formData});
    }

    handleSubmit(event) {
        let that = this;
        this.normalizeFormData();

        let data = Object.assign({}, this.state.formData);
        data.files = this.state.files;

        let downloaded = this.state.downloaded;

        NProgress.start();

        axios.post('/process', data, {
            responseType: 'blob'
        })
            .then((response) => {
                downloaded.push({
                    name: data.filename,
                    blob: response.data
                });

                that.setState({ downloaded: downloaded });

                NProgress.done();
            })
            .catch((error) => {
                if (error.response.data) {
                    // convert JSON blob back to JSON - can this be handled better?
                    let reader = new FileReader();
                    reader.readAsText(error.response.data);
                    reader.onloadend = () => {
                        let errorJson = JSON.parse(reader.result);
                        if (errorJson && errorJson.error) {
                            that.addError(errorJson.error);
                        }
                    }
                }

                NProgress.done();
            });

        event.preventDefault();
    }

    render() {
        return (
            <div className="container">

                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">
                        <div className="col-12">
                            <ErrorList errors={this.state.errors} removeError={this.removeError.bind(this)} />
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-6">

                            <div className="card">
                                <div className="card-block">
                                    <h4 className="card-title">
                                        Files

                                        <a href="#" className="clear-link" onClick={this.clearFiles.bind(this)} hidden={this.state.files.length === 0}>
                                            <i className="fa fa-trash-o" />
                                            clear
                                        </a>
                                    </h4>
                                </div>
                                <div className="card-block card-block--no-pt">
                                    <FileDropzone addFiles={this.addFiles.bind(this)}/>
                                </div>
                                <div className="card-block card-block--no-pt" hidden={this.state.files.length === 0}>
                                    <FileList files={this.state.files} removeFile={this.removeFile.bind(this)}/>
                                </div>
                            </div>

                        </div>

                        <div className="col-6">

                            <div className="row">
                                <div className="col-12">

                                    <div className="card">
                                        <div className="card-block">
                                            <FormElements formData={this.state.formData} setFormData={this.setFormData.bind(this)}/>
                                        </div>

                                        <div className="card-block card-block--no-pt submit-group">
                                            <input type="submit" className="btn btn-primary btn-lg" value="Generate Excel File" disabled={this.state.files.length === 0}/>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">

                                    <div id="results-card" className="card" hidden={this.state.downloaded.length === 0}>
                                        <div className="card-block">
                                            <h4 className="card-title">
                                                Results

                                                <a href="#" className="clear-link" onClick={this.clearDownloadedFiles.bind(this)}>
                                                    <i className="fa fa-trash-o" />
                                                    clear
                                                </a>
                                            </h4>
                                        </div>
                                        <div className="card-block card-block--no-pt">
                                            <DownloadList files={this.state.downloaded} removeDownloadedFile={this.removeDownloadedFile.bind(this)} />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
