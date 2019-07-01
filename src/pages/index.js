import { Component } from 'react'
import { Card, Row, Col, Button, Icon } from 'antd'
import Link from 'umi/link'
// import brace from 'brace'
import AceEditor from 'react-ace'
import schemaEditor from 'json-schema-editor-visual/dist/main.js'
import { connect } from 'dva'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import 'antd/dist/antd.css'
import 'json-schema-editor-visual/dist/main.css'

const option = {}
const SchemaEditor = schemaEditor(option)

@connect(({ bucciarati }) => {
  return {
    template: bucciarati.template,
    schema: bucciarati.schema
  }
})
class Pronto extends Component {
  render() {
    const {dispatch} = this.props
    return <Card
      extra={
        <Link to='/Arrivederci'>
          <Button type="primary">next<Icon type="right" /></Button>
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
            onChange={(value)=>dispatch({ type: 'bucciarati/updateTemplate', payload: value })}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={this.props.template}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }} />
        </Col>
        <Col span={12}>
          <SchemaEditor
            data={JSON.stringify(this.props.schema)}
            onChange={schema => {
              dispatch({ type: 'bucciarati/updateSchema', payload: JSON.parse(schema) });
            }}
          />
        </Col>
      </Row>
    </Card>
  }
}

export default Pronto