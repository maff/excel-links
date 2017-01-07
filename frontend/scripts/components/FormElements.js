const React = require('react');

class FormElements extends React.Component {
    constructor(props) {
        super(props);

        this.updateFormData = props.updateFormData;

        this.state = props.formData;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event);
        console.log(event.target);
        console.log(event.target.name);

        let state = {};
        state[event.target.name] = event.target.value;

        this.setState(state);

        console.log(this.state);
    }

    render() {
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
                        value={this.state.filename}
                        onChange={this.handleChange}
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
                        value={this.state.imagePath}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        );
    }
}

export default FormElements;
