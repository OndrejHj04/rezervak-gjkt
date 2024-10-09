"use client"
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function CustomEditor(props: any) {
  const editorRef = useRef<any>(null);
  const { init, variables, onChange, ...rest } = props

  return (
    <React.Fragment>
      <Editor apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
        {...rest}
        onInit={(_evt, editor) => editorRef.current = editor}
        init={{
          skin: "oxide-dark",
          content_css: "dark",
          menubar: false,
          plugins: ["lists", "link"],
          toolbar: "bold italic | alignleft aligncenter alignright | outdent indent | bullist numlist | link | mySelectPicker",
          setup(editor) {
            editor.ui.registry.addMenuButton('mySelectPicker', {

              text: 'Proměnné',
              fetch: (callback) => {
                const items = variables.map((variable: any) => ({
                  type: 'menuitem',
                  text: variable,
                  onAction: () => editor.insertContent(`\${${variable}}`)
                }))
                callback(items as any);
              }
            })
          },
          ...init
        }}
      />
    </React.Fragment>
  )
}
