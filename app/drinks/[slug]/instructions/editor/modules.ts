export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
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
  'align', 'list', 'bullet', 'indent', 'link' // Include link in the formats
];