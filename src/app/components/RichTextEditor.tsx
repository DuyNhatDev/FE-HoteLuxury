import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [editorContent, setEditorContent] = useState(value || "");

  useEffect(() => {
    setEditorContent(value || "");
  }, [value]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    //const plainText:string = content.replace(/<\/?[^>]+(>|$)/g, "");
    if (onChange) {
      onChange(content);
      //onChange(plainText);
    }
  };


  return (
    <Paper elevation={3} className="p-4">
      <Typography variant="h6" gutterBottom>
        Mô tả
      </Typography>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={{
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
          },
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "video",
          "code-block",
        ]}
        className="custom-quill-editor"
      />
    </Paper>
  );
};

export default RichTextEditor;
