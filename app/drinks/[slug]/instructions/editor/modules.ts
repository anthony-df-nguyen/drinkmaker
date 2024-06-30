export const modules = {
  toolbar: [
    [{ header: [false, 1, 2, 3, 4, 5] }],
    [{ color: [] }],
    [{ background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ['link'], // Enable link in the toolbar
    ["clean"], // Correctly specify 'clean' as a string
  ],
};

export const formats = [
  'header', 'color', 'background',
  'bold', 'italic', 'underline', 'strike',
  'align', 'list', 'indent', 'link'
];