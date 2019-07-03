import { Component } from 'react'
import { Card, Row, Col, Button, Icon } from 'antd'
import Link from 'umi/link'
// import AceEditor from 'react-ace'
// import 'brace/mode/javascript'
// import 'brace/theme/tomorrow'
import { connect } from 'dva'
import Form from 'react-jsonschema-form'
import 'bootstrap/dist/css/bootstrap.css'
import { Editor } from 'slate-react'
import jp from 'jsonpath'
import { Value } from 'slate'
// import Plain from 'slate-plain-serializer'
import { isKeyHotkey } from 'is-hotkey'
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')


const getDefaultData = (schema) => {
    var data = {}
    const { properties } = schema
    Object.keys(properties).map((item) => {
        switch (properties[item].type) {
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

    componentDidMount() {
        const { schema, dispatch } = this.props
        const data = getDefaultData(schema)
        dispatch({ type: 'bucciarati/updateData', payload: data })
    }

    ref = editor => {
        this.editor = editor
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

    onChange = ({ value }) => {
        return
    }

    render() {
        const { template, dispatch, data } = this.props
        // const text = Plain.serialize(this.props.template)
        // console.log(text)
        var jval = JSON.parse(JSON.stringify(template))
        if (data !== undefined) {
            console.log(jp.query(template,'$..text'))
            jp.apply(jval, '$..text', (value) => {
                return eval('`'+value+'`')
            })
            console.log(jp.query(template,'$..text'))
        }
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

                        {/* <Editor style={{height: 500,overflowY: 'scroll'}} placeholder="Placeholder" value={Value.fromJSON(this.props.template)} onChange={this.onChange} /> */}
                        <Editor
                            style={{ height: 500, overflowY: 'scroll' }}
                            spellCheck
                            autoFocus
                            placeholder="Enter some rich text..."
                            ref={this.ref}
                            value={Value.fromJSON(jval)}
                            onChange={this.onChange}
                            onKeyDown={this.onKeyDown}
                            renderBlock={this.renderBlock}
                            renderMark={this.renderMark}
                            readOnly={true}
                        />
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
                            onChange={e => {return}}
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