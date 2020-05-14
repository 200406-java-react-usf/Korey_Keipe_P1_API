/**
 * Validation of acceptable ID. (must be a non-negative integer value)
 * @param {string} id - unique key for specific element in the database.
 */
export const validateId = (id: number): boolean =>{
	return (id && typeof id === 'number' && Number.isInteger(id) && id > 0);
};

/**
 * Validation of acceptable string. 
 * @param {string} string - must be a truthy value, and not empty
 */
export const validateString = (...string: string[]): boolean => {
	return (string.filter(string => !string || typeof string !== 'string').length == 0);
};

/**
 * Validation of acceptable object. 
 * @param {string} obj - must be a truthy value where each element is not empty
 */
export const validateObj = (obj: Object, ...nullProperties: string[]) =>{
	return obj && Object.keys(obj).every(key => {
		if(nullProperties.includes(key)) return true;
		return obj[key];
	});
};

/**
 * Validation of an empty object. 
 * @param {string} obj - must be an object that is not empty
 */
export const vaildateEmptyObj = (obj: Object) => {
	if (Object.keys(obj).length == 0){
		return true;
	}
};

/**
 * deteremine if a specified proper is of a particular type 
 * @param {string} prop - property of an object
 * @param {string} type - data type 
 */
export const isPropertyOf = (prop: string, type: any) => {
	if(!prop || !type){
		return false;
	}

	let typeCreator = <T> (Type: (new () => T)): T => {
		return new Type();
	};

	let instance;
	try{
		instance = typeCreator(type);
	} catch {
		return false;
	}

	return Object.keys(instance).includes(prop);

};

export default {
	validateId,
	validateObj,
	validateString,
	vaildateEmptyObj,
	isPropertyOf
};