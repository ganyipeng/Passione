import { Component } from 'react'
import { Card, Row, Col, Button, Icon } from 'antd'
import Link from 'umi/link'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import { connect } from 'dva'
import Form from 'react-jsonschema-form'

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
    componentDidMount(){
        const {schema,dispatch} = this.props
        const data = getDefaultData(schema)
        dispatch({ type: 'bucciarati/updateData', payload: data })
    }

    render() {
        const {data,dispatch,template} = this.props
        const tpl = data!==undefined?template:''
        debugger
        const val = eval('`' + tpl + '`')
        return <Card
            extra={
                <Link to='/'>
                    <Button type="primary"><Icon type="left" />prev</Button>
                </Link>
            }
            style={{ height: '80%', margin: '20px' }}
        >
            <Row>
                <Col span={12}>
                    <AceEditor
                        placeholder="Placeholder Text"
                        mode="javascript"
                        theme="tomorrow"
                        name="Demo Editor"
                        onLoad={this.onLoad}
                        onChange={this.onChange}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={val}
                        readOnly={true}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
                        }} />
                </Col>
                <Col span={12}>
                    <Form
                        schema={this.props.schema}
                        formData={this.props.data}
                        onChange={e => console.log(e)}
                        onSubmit={e => dispatch({ type: 'bucciarati/updateData', payload: e.formData })}
                        onError={e => console.log(e)}
                    />
                </Col>
            </Row>
        </Card>
    }
}

export default Arrivederci