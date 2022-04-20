import { isString, pick } from 'lodash';

import {
	Association,
	ConstructionPeriod,
	Date,
	FirstNationAssociation,
	FunctionalUse,
	HistoricalPattern,
	Name,
	Ownership,
	PlainObject,
	PreviousOwnership,
	Theme,
} from '.';

import { Contact, Description, RevisionLog, WebLink } from '../data';

export class Place {
	id?: number;
	block?: string;
	bordenNumber?: string;
	buildingSize?: string;
	category?: number;
	cIHBNumber?: string;
	communityId?: number;
	conditionComment?: string;
	contributingResources?: string | string[] | null;
	coordinateDetermination?: number;
	currentUseComment?: string;
	designations?: string | string[] | null;
	doorCondition?: number;
	fHBRONumber?: string;
	floorCondition?: number;
	geocode?: string;
	groupYHSI?: string;
	hasPendingChanges?: boolean;
	hectareArea?: string;
	isPubliclyAccessible?: boolean;
	jurisdiction?: number;
	lAGroup?: string;
	latitude?: string;
	locationComment?: string;
	locationContext?: string;
	longitude?: string;
	lot?: string;
	mailingAddress?: string;
	mailingCountry?: string;
	mailingPostalCode?: string;
	mailingProvince?: string;
	nTSMapSheet?: string;
	otherCommunity?: string;
	otherLocality?: string;
	ownerConsent?: number;
	physicalAddress?: string;
	physicalCountry?: string;
	physicalPostalCode?: string;
	physicalProvince?: string;
	planNumber?: string;
	previousAddress?: string;
	primaryName?: string;
	recognitionDate?: Date;
	recognitionDateDisplay?: string;
	records?: string | string[] | null;
	resourceType?: string;
	rollNumber?: string;
	roofCondition?: number;
	showInRegister?: boolean;
	siteCategories?: string | string[] | null;
	siteDistrictNumber?: string;
	siteStatus?: number;
	slideNegativeIndex?: string;
	statute2Id?: number;
	statuteId?: number;
	townSiteMapNumber?: string;
	wallCondition?: number;
	yGBuildingNumber?: string;
	yGReserveNumber?: string;
	yHSIId?: string;
	yHSPastUse?: string;
	yHSThemes?: string;
	zoning?: string;

	// Associations
	associations?: Association[];
	constructionPeriods?: ConstructionPeriod[];
	contacts?: Contact[];
	dates?: Date[];
	descriptions?: Description[];
	firstNationAssociations?: FirstNationAssociation[];
	functionalUses?: FunctionalUse[];
	historicalPatterns?: HistoricalPattern[];
	names?: Name[];
	ownerships?: Ownership[];
	previousOwnerships?: PreviousOwnership[];
	revisionLogs?: RevisionLog[];
	themes?: Theme[];
	webLinks?: WebLink[];

	[key: string]: any;

	private fields: ReadonlyArray<string> = Object.freeze([
		'id',
		'block',
		'bordenNumber',
		'buildingSize',
		'category',
		'cIHBNumber',
		'communityId',
		'conditionComment',
		'contributingResources',
		'coordinateDetermination',
		'currentUseComment',
		'designations',
		'doorCondition',
		'fHBRONumber',
		'floorCondition',
		'geocode',
		'groupYHSI',
		'hectareArea',
		'isPubliclyAccessible',
		'jurisdiction',
		'lAGroup',
		'latitude',
		'locationComment',
		'locationContext',
		'longitude',
		'lot',
		'mailingAddress',
		'mailingCountry',
		'mailingPostalCode',
		'mailingProvince',
		'nTSMapSheet',
		'otherCommunity',
		'otherLocality',
		'ownerConsent',
		'physicalAddress',
		'physicalCountry',
		'physicalPostalCode',
		'physicalProvince',
		'planNumber',
		'previousAddress',
		'primaryName',
		'recognitionDate',
		'records',
		'resourceType',
		'rollNumber',
		'roofCondition',
		'showInRegister',
		'siteCategories',
		'siteDistrictNumber',
		'siteStatus',
		'slideNegativeIndex',
		'statute2Id',
		'statuteId',
		'townSiteMapNumber',
		'wallCondition',
		'yGBuildingNumber',
		'yGReserveNumber',
		'yHSIId',
		'yHSPastUse',
		'yHSThemes',
		'zoning',
	]);

	static COMMA_DELIMITED_ARRAY_COLUMNS: ReadonlyArray<string> = Object.freeze([
		'contributingResources',
		'designations',
		'records',
		'siteCategories',
	]);

	constructor(attributes: PlainObject) {
		Object.entries(attributes).forEach(([key, value]) => {
			if (Place.COMMA_DELIMITED_ARRAY_COLUMNS.includes(key)) {
				this[key] = Place.encodeCommaDelimitedArray(value);
			} else {
				this[key] = value;
			}
		});
	}

	toDbObject(): PlainObject {
		const dbObject: PlainObject = {};
		this.fields.forEach((field) => {
			if (field === 'id') {
				// drop the id column
			} else if (this[field] !== undefined) {
				dbObject[field] = this[field];
			}
		});
		return dbObject;
	}

	static encodeCommaDelimitedArray(
		value: undefined | null | string | string[]
	): string | null {
		if (
			value === undefined ||
			value === null ||
			value === '' ||
			value.length === 0
		)
			return null;
		if (isString(value)) return value;

		return value.join(',');
	}

	static decodeCommaDelimitedArray(
		value: undefined | null | string | string[]
	): string[] {
		if (value === undefined || value === null || value === '') return [];
		if (Array.isArray(value)) return value;

		return value.split(',');
	}

	static decodeCommaDelimitedArrayColumns(object: PlainObject) {
		if (!object) return object;

		Place.COMMA_DELIMITED_ARRAY_COLUMNS.forEach((column) => {
			if (!object.hasOwnProperty(column)) return;

			object[column] = Place.decodeCommaDelimitedArray(object[column]);
		});

		return object;
	}
}
