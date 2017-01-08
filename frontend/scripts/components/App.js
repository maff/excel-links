import React from 'react';
import FileDropzone from './FileDropzone';
import FileList from './FileList';
import FormElements from './FormElements';
import DownloadList from './DownloadList';

import axios from 'axios';
import NProgress from 'nprogress';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                filename: 'excel-links.xlsx',
                imagePath: 'images'
            },
            files: [],
            downloaded: []
        };
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

    handleSubmit(event) {
        let that = this;

        let data = Object.assign({}, this.state.formData);
        data.files = [];

        this.state.files.forEach((file) => {
            data.files.push(file.name);
        });

        let downloaded = this.state.downloaded;

        NProgress.start();
        axios.post('/process', data, {
            responseType: 'blob',
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
                console.log(error);
                NProgress.done();
            });

        event.preventDefault();
    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">

                        <div className="col-4">

                            <div className="card">
                                <div className="card-block">
                                    <h4 className="card-title">Files</h4>
                                    <a href="#" onClick={this.clearFiles.bind(this)} hidden={this.state.files.length === 0}>clear</a>
                                </div>
                                <div className="card-block card-block--no-pt">
                                    <FileDropzone addFiles={this.addFiles.bind(this)}/>
                                </div>
                                <div className="card-block card-block--no-pt" hidden={this.state.files.length === 0}>
                                    <FileList files={this.state.files} removeFile={this.removeFile.bind(this)}/>
                                </div>
                            </div>

                        </div>

                        <div className="col-4">
                            <FormElements formData={this.state.formData} setFormData={this.setFormData.bind(this)}/>

                            <div className="form-group submit-group">
                                <input type="submit" className="btn btn-primary btn-lg" value="Process" disabled={this.state.files.length === 0}/>
                            </div>
                        </div>

                        <div className="col-4">

                            <div className="card" hidden={this.state.downloaded.length === 0}>
                                <div className="card-block">
                                    <h4 className="card-title">Results</h4>
                                    <a href="#" onClick={this.clearDownloadedFiles.bind(this)}>clear</a>
                                </div>
                                <div className="card-block card-block--no-pt">
                                    <DownloadList files={this.state.downloaded} removeDownloadedFile={this.removeDownloadedFile.bind(this)} />
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
