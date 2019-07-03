import { Component } from 'react'
import { Card, Row, Col, Button, Icon } from 'antd'
import Link from 'umi/link'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import { connect } from 'dva'
import Form from 'react-jsonschema-form'
import 'bootstrap/dist/css/bootstrap.css'
import {Editor} from 'slate-react'
import {Value} from 'slate'
import Plain from 'slate-plain-serializer'


const getDefaultData = (schema) => {
    var data = {}
    const {properties} = schema
    Object.keys(properties).map((item)=>{
        switch(properties[item].type){
            case 'string':
                data[item] = ''
                break
            case 'number':
                data[item] = 0
                break
            case 'array':
                data[item] = []
                break
            case 'boolean':
                data[item] = false
                break
            case 'integer':
                data[item] = 0
                break
            case 'object':
                data[item] = getDefaultData(properties[item])
                break
            default:
                console.log(properties[item].type)
                break
        }
    })
    return data
}

@connect(({ bucciarati }) => {
    return {
        template: bucciarati.template,
        schema: bucciarati.schema,
        data: bucciarati.data,
    }
})
class Arrivederci extends Component {
    state = {
        value: Value.fromJSON(this.props.template),
    }

    componentDidMount(){
        const {schema,dispatch} = this.props
        const data = getDefaultData(schema)
        dispatch({ type: 'bucciarati/updateData', payload: data })
    }

    onChange = ({value}) => {
        this.props.dispatch({ type: 'bucciarati/updateTemplate', payload: value });
        this.setState({value: this.props.template});
    }

    render() {
        const {data,dispatch,template} = this.props
        const tpl = data!==undefined?template:''
        // debugger
        const text = Plain.serialize(this.props.template)
        console.log(text)
        const val = eval('`' + tpl + '`')
        return <Card
            extra={
                <Link to='/'>
                    <Button type="primary"><Icon type="left" />prev</Button>
                </Link>
            }
            style={{ height: '95%', margin: '20px' }}
        >
            <Row>
                <Col span={12}>
                    <Card 
                    style={{
                        width: '100%',
                        height: 550,
                    }}
                    >
                    
                    <Editor 
                        style={{height: 500,overflowY: 'scroll'}} 
                        placeholder="Placeholder" 
                        value={Value.fromJSON(this.props.template)} 
                        onChange={this.onChange} 
                        readOnly={true}/>        
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered style={{
                        width: '100%',
                        height: 550,
                    }}>
                    <Form
                        schema={this.props.schema}
                        formData={this.props.data}
                        onChange={e => console.log(e)}
                        onSubmit={e => dispatch({ type: 'bucciarati/updateData', payload: e.formData })}
                        onError={e => console.log(e)}
                    />
                    </Card>
                </Col>
            </Row>
        </Card>
    }
}

export default Arrivederci