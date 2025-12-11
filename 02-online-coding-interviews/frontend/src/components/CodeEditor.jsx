import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

const CodeEditor = ({ code, onChange, language = 'javascript' }) => {
  const extensions = language === 'python' ? [python()] : [javascript()]

  return (
    <div style={{ border: '1px solid #ddd' }}>
      <CodeMirror
        value={code}
        height="400px"
        extensions={extensions}
        onChange={(value) => onChange(value)}
      />
    </div>
  )
}

export default CodeEditor
