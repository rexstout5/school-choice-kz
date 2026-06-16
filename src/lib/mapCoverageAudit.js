import { getLocalizedEnumLabel, getLocalizedSchoolValue } from '../data/schools.js';

export const hasDisplayableCoordinates = (school) =>
  typeof school.latitude === 'number' &&
  typeof school.longitude === 'number' &&
  school.coordinates_status !== 'missing';

export const getMapCoverageAudit = (schoolList, language = 'en') => {
  const totalSchools = schoolList.length;
  const schoolsDisplayedOnMap = schoolList.filter(hasDisplayableCoordinates).length;
  const schoolsMissingCoordinates = schoolList.filter((school) => !hasDisplayableCoordinates(school));

  return {
    totalSchools,
    schoolsDisplayedOnMap,
    schoolsMissingCoordinates: schoolsMissingCoordinates.length,
    coveragePercent: totalSchools === 0 ? 0 : Number(((schoolsDisplayedOnMap / totalSchools) * 100).toFixed(1)),
    coordinateStatusCounts: schoolList.reduce((counts, school) => {
      const status = school.coordinates_status ?? 'missing';
      return { ...counts, [status]: (counts[status] ?? 0) + 1 };
    }, { verified: 0, estimated: 0, missing: 0 }),
    schoolsWithoutCoordinates: schoolsMissingCoordinates.map((school) => ({
      id: school.id,
      name: getLocalizedSchoolValue(school.name, language),
      district: getLocalizedEnumLabel('districts', school.district, language),
      address: getLocalizedSchoolValue(school.address, language),
      coordinates_status: school.coordinates_status ?? 'missing'
    }))
  };
};
