// RichTextEditor.js
import React, { useRef, useEffect, useMemo, useState } from 'react';
import JoditEditor from 'jodit-react';
import { debounce } from 'lodash';

const CustomEditor = ({ placeholder, initialContent, handleChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || 'Start typings...'
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
