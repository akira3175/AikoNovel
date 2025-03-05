import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Editor = ({ initialContent, onChange }) => {
    const [content, setContent] = useState(initialContent || "");

    return (
        <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
                onChange && onChange(data); // Gửi nội dung lên parent component
            }}
        />
    );
};

export default Editor;
