export const TemplateHeader = (patDetaills) => {
  return `
        <p style="border: 1px solid; display: flex; justify-content: center; line-height: 2">
          <strong>Patient Name:</strong> ${patDetaills?.po_pat_name}   <strong>Sex / Age: </strong>${patDetaills?.po_pat_sex} / 30</p> <br/>`
}
