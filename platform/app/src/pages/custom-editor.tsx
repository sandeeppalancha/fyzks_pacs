// RichTextEditor.js
import React, { useRef, useEffect, useMemo, useState } from 'react';
import JoditEditor from 'jodit-react';
import { debounce } from 'lodash';

const CustomEditor = ({ placeholder, initialContent, handleChange, fromReporting }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const custprops = fromReporting ? {
    height: 1122, // A4 height in pixels (96 DPI)
    width: 794, // A4 width in pixels (96 DPI)
  } : {}

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || 'Start typings...',
      uploader: {
        insertImageAsBase64URI: true, // Enable image upload as Base64
      },
      ...custprops,
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={handleChange} // preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => { debounce(() => { handleChange(newContent) }, 200) }}
    />
  );
}

export default CustomEditor;
