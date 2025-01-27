
import { makePostCall } from "../../../../platform/app/src/utils/helper";

const studyCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

async function getStudiesForPatientByMRN(dataSource, qidoForStudyUID, from = 'unknown') {
  if (qidoForStudyUID && qidoForStudyUID.length && qidoForStudyUID[0].mrn) {
    const mrn = qidoForStudyUID[0].mrn;
    
    // Check cache
    const cached = studyCache.get(mrn);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      console.log(`Using cached studies for MRN from ${from}`);
      return cached.data;
    }

    console.log(`Fetching studies by MRN called from ${from}`);

    const studiesByMrn = await dataSource.query.studies.search({
      patientId: mrn,
    });

    // Cache the result
    studyCache.set(mrn, {
      data: studiesByMrn,
      timestamp: Date.now()
    });

    return studiesByMrn;
  }
}

export default getStudiesForPatientByMRN;
