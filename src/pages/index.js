import React, { Component } from 'react'
import { Card, Row, Col, Button, Icon, Menu} from 'antd'
import Link from 'umi/link'
// import brace from 'brace'
import AceEditor from 'react-ace'
import schemaEditor from 'json-schema-editor-visual/dist/main.js'
import { connect } from 'dva'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import 'antd/dist/antd.css'
import 'json-schema-editor-visual/dist/main.css'
import {Editor} from 'slate-react'
import {Value} from 'slate'

const option = {}
const SchemaEditor = schemaEditor(option)

@connect(({ bucciarati }) => {
  return {
    template: bucciarati.template,
    schema: bucciarati.schema
  }
})

class Pronto extends Component {
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      value: this.props.template,
    }
  }

  onChange = ({value}) => {
    this.props.dispatch({ type: 'bucciarati/updateTemplate', payload: value });
    this.setState({value: this.props.template});
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  render() {
    const {dispatch} = this.props
    return( 
    <div>
      {/* <PageHeader onBack={()=>(<Link to='/Arrivederci'></Link>)} title="" backIcon={<Icon type="arrow-right" />} /> */}
    <Card
      bordered
      extra={
        <Link to='/Arrivederci'>
          <Button type="primary">next<Icon type="right" /></Button>
        </Link>
      }
      style={{ height: '95%', margin: '20px' }}
    >
      <Row>
        <Col span={12}>
          <Card>
          <Editor 
            style={{height: 500,overflowY: 'scroll'}} 
            placeholder="Placeholder" 
            value={Value.fromJSON(this.props.template)} 
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderBlock={this.renderBlock}
            renderMark={this.renderMark} />
          {/* <AceEditor
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
            }} /> */}
            </Card>
        </Col>
        {/* <Col span={1}>
          <Row><Divider type="vertical" /></Row>
        </Col> */}
        <Col span={12}>
          <Card bordered 
          style={{
            width: '100%',
            height: 550,
                    }}>
          <SchemaEditor
            data={JSON.stringify(this.props.schema)}
            onChange={schema => {
              dispatch({ type: 'bucciarati/updateSchema', payload: JSON.parse(schema) });
            }}
          />
          </Card>
        </Col>
      </Row>
    </Card>
    </div>)
  }
}

export default Pronto