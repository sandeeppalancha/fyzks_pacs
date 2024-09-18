import { makePostCall } from "../../../../platform/app/src/utils/helper";

async function getStudiesForPatientByMRN(dataSource, qidoForStudyUID) {
  if (qidoForStudyUID && qidoForStudyUID.length && qidoForStudyUID[0].mrn) {

    const accession = qidoForStudyUID[0].accession;
    const bodyPartRes = await makePostCall("/get-body-part-study-ids", {accession});
    const accession_nums = bodyPartRes.data?.accession_nums;


    const promises = accession_nums.map(accNum => {
      return dataSource.query.studies.search({ accessionNumber: accNum });
    });

    const studyResults = await Promise.all(promises);

    // console.log("studyResults studiesByMrn2", studyResults);

    // Combine and return the results
    return studyResults.flat();

    // const studiesByMrn = dataSource.query.studies.search({
    //   patientId: qidoForStudyUID[0].mrn,
    //   accessionNumber: body_part,
    //   '00180015': body_part,
    //   modalitiesInStudy: 'CT'
    // });
    // console.log("studiesByMrn", studiesByMrn);

    // return studiesByMrn;
  }
  console.log('No mrn found for', qidoForStudyUID);
  return qidoForStudyUID;
}

export default getStudiesForPatientByMRN;
