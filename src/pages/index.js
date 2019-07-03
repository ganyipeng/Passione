import React, { Component } from 'react'
import Antd,{ Card, Row, Col, Icon } from 'antd'
import Link from 'umi/link'
import schemaEditor from 'json-schema-editor-visual/dist/main.js'
import { connect } from 'dva'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'
import 'antd/dist/antd.css'
import 'json-schema-editor-visual/dist/main.css'
import { Editor } from 'slate-react'
import { isKeyHotkey } from 'is-hotkey'
import { Value } from 'slate'
import {  Toolbar, Button } from './component'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1275479_dktozkdwb0v.js',
});
const AntButton = Antd.Button
const option = {}
const SchemaEditor = schemaEditor(option)
const DEFAULT_NODE = 'paragraph'
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

@connect(({ bucciarati }) => {
  return {
    template: bucciarati.template,
    schema: bucciarati.schema
  }
})

class Pronto extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      value: Value.fromJSON(this.props.template),
    }
  }

  hasMark = type => {
    const {activeMarks} = this.state.value
    return activeMarks===undefined?false:activeMarks.some(mark => mark.type === type)
  }

  hasBlock = type => {
    const {blocks} = this.state.value
    return blocks===undefined?false:blocks.some(node => node.type === type)
  }

  ref = editor => {
    this.editor = editor
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  // onChange = ({value}) => {
  //   this.props.dispatch({ type: 'bucciarati/updateTemplate', payload: value });
  //   this.setState({value: this.props.template});
  //   console.log(this.state.value)
  // }

  onSubmit = () => {
    const value = this.state.value
    this.props.dispatch({ type: 'bucciarati/updateTemplate', payload: value.toJSON() });
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon type={icon} />
      </Button>
    )
  }

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks&&blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        {/* <Icon type={icon} /> */}
        <IconFont type={icon} />
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

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }

  render() {
    const { dispatch } = this.props
    return (
      <div>
        <Card
          bordered
          extra={
            <Link to='/Arrivederci'>
              <AntButton type="primary">next<Icon type="right" /></AntButton>
            </Link>
          }
          style={{ height: '95%', margin: '20px' }}
        >
          <Row>
            <Col span={12}>
              <Row>
              <Card>
                  {/* <link rel="stylesheet" href="https://at.alicdn.com/t/font_1275479_17sgj6yd9g5.css"> */}
                  <Toolbar>
                    {this.renderMarkButton('bold', 'bold')}
                    {this.renderMarkButton('italic', 'italic')}
                    {this.renderMarkButton('underlined', 'underline')}
                    {/* {this.renderMarkButton('code', 'code')} */}
                    {this.renderBlockButton('heading-one', 'icon-looksone')}
                    {this.renderBlockButton('heading-two', 'icon-lookstwo')}
                    {this.renderBlockButton('block-quote', 'icon-quote2')}
                    {this.renderBlockButton('numbered-list', 'icon-orderedlist')}
                    {this.renderBlockButton('bulleted-list', 'icon-unorderedlist')}
                  </Toolbar>
                  <Editor
                    style={{ height: 500,overflowY: 'scroll' }}
                    spellCheck
                    autoFocus
                    placeholder="Enter some rich text..."
                    ref={this.ref}
                    value={this.state.value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    renderBlock={this.renderBlock}
                    renderMark={this.renderMark}
                  />
              </Card>
              </Row>
              <Row>
                <Col span={21}></Col>
                <Col span={3}><AntButton type="primary" style={{marginTop: '10px'}} onClick={this.onSubmit}>Submit</AntButton></Col>
              </Row>
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