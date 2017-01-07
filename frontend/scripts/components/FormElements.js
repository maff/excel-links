import React from 'react';

class FormElements extends React.Component {
    handleChange(event) {
        console.log(event);
        console.log(event.target);
        console.log(event.target.name);

        this.props.setFormData(event.target.name, event.target.value);
    }

    render() {
        let handleChange = this.handleChange.bind(this);

        return (
            <div>
                <div className="form-group">
                    <label htmlFor="inputFilename">Filename</label>
                    <input
                        type="text"
                        name="filename"
                        className="form-control"
                        id="inputFilename"
                        placeholder="Enter filename (*.xlsx)"
                        pattern="^.*\.xlsx$"
                        value={this.props.formData.filename}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="inputImagePath">Image Path</label>
                    <input
                        type="text"
                        name="imagePath"
                        className="form-control"
                        id="inputImagePath"
                        placeholder="Enter path to images"
                        value={this.props.formData.imagePath}
                        onChange={handleChange}
                    />
                </div>
            </div>
        );
    }
}

export default FormElements;
