import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import { body, check, query, validationResult } from 'express-validator';
import { PhotoService } from '../services';
import { Photo, SavedFilter } from '../data';
import multer from 'multer';
import { createThumbnail } from '../utils/image';
import { ReturnValidationErrors } from '../middleware';
import sharp from 'sharp';

const photoService = new PhotoService(DB_CONFIG);
const PAGE_SIZE = 12;

export const photoRouter = express.Router();

photoRouter.get(
	'/',
	[query('page').default(1).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		let page = parseInt(req.query.page as string);
		let skip = (page - 1) * PAGE_SIZE;
		let take = PAGE_SIZE;

		let list = await photoService
			.getAll(skip, take)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		let item_count = await photoService
			.getPhotoCount()
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return 0;
			});

		let page_count = Math.ceil(item_count / PAGE_SIZE);

		if (list) {
			return res.json({
				data: list,
				meta: { page, page_size: PAGE_SIZE, item_count, page_count },
			});
		}

		return res.status(500).send('Error');
	}
);

photoRouter.post(
	'/search',
	[body('page').isInt().default(1)],
	async (req: Request, res: Response) => {
		let { query, sort, page } = req.body;

		let skip = (page - 1) * PAGE_SIZE;
		let take = PAGE_SIZE;
		await photoService
			.doSearch(query, sort, page, PAGE_SIZE, skip, take)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ errors: [err] });
			});
	}
);

photoRouter.get(
	'/:id',
	[check('id').notEmpty().isUUID()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		await photoService
			.getById(req.params.id)
			.then((photo) => {
				if (photo) return res.json({ data: photo });

				return res.status(404).send('Photo not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Photo not found');
			});
	}
);

photoRouter.get(
	'/:id/file',
	[check('id').notEmpty().isUUID()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		await photoService
			.getFileById(req.params.id)
			.then((photo) => {
				if (photo && photo.file) {
					//return res.contentType("image/jpg").send(photo.file);
					return res.json({ data: photo.file });
				}

				return res.status(404).send('Photo not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Photo not found');
			});
	}
);

photoRouter.get(
	'/:id/thumbfile',
	[check('id').notEmpty().isUUID()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		await photoService
			.getThumbFileById(req.params.id)
			.then((photo) => {
				if (photo && photo.thumbFile) {
					//return res.contentType("image/jpg").send(photo.thumbFile);
					return res.json({ data: photo.thumbFile });
				}

				return res.status(404).send('Photo not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Photo not found');
			});
	}
);

photoRouter.get(
	'/:id/file/thumbnail',
	[check('id').notEmpty().isUUID()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		await photoService
			.getFileById(req.params.id)
			.then(async (photo) => {
				if (photo && photo.file) {
					let t = await createThumbnail(photo.file);
					return res.contentType('image/jpg').send(t);
				}

				return res.status(404).send('Photo not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Photo not found');
			});
	}
);

photoRouter.post(
	'/',
	multer().single('file'),
	[
		body('communityId').notEmpty().bail().isInt(),
		body('isOtherRecord').notEmpty().bail().isBoolean(),
		body('originalMediaId').notEmpty().bail().isInt(),
		body('mediaStorage').notEmpty().bail().isInt(),
		body('copyright').notEmpty().bail().isInt(),
		body('ownerId').notEmpty().bail().isInt(),
		body('photoProjectId').notEmpty().bail().isInt(),
		body('program').notEmpty().bail().isInt(),
		body('isComplete').notEmpty().bail().isBoolean(),
		body('isSiteDefault').notEmpty().bail().isBoolean(),
		body('isPrivate').notEmpty().bail().isBoolean(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		req.body.file = req.file.buffer;
		req.body.thumbFile = await createThumbnail(req.file.buffer);
		req.body.originalFileName = req.file.originalname;

		if (!errors.isEmpty()) {
			//console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await photoService
			.addPhoto(req.body as Photo)
			.then((item) => item)
			.catch((err) => {
				//console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
	}
);

photoRouter.put(
	'/:id',
	multer().single('file'),
	[
		check('id').notEmpty().isUUID(),
		body('communityId').notEmpty().bail().isInt(),
		body('isOtherRecord').notEmpty().bail().isBoolean(),
		body('originalMediaId').notEmpty().bail().isInt(),
		body('mediaStorage').notEmpty().bail().isInt(),
		body('copyright').notEmpty().bail().isInt(),
		body('ownerId').notEmpty().bail().isInt(),
		body('photoProjectId').notEmpty().bail().isInt(),
		body('program').notEmpty().bail().isInt(),
		body('isComplete').notEmpty().bail().isBoolean(),
		body('isSiteDefault').notEmpty().bail().isBoolean(),
		body('isPrivate').notEmpty().bail().isBoolean(),
	],
	async (req: Request, res: Response) => {
		let updater = req.body;
		const errors = validationResult(req);

		delete updater.file;

		if (
			req.file != null &&
			req.file != 'undefined' &&
			req.file.buffer != null &&
			req.file.buffer != 'undefined'
		) {
			updater.file = req.file.buffer;
			updater.thumbFile = await createThumbnail(req.file.buffer);
			updater.originalFileName = req.file.originalname;
		}

		if (!errors.isEmpty()) {
			//console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await photoService
			.updatePhoto(req.params.id, updater as Photo)
			.then((item) => item)
			.catch((err) => {
				//console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
	}
);

photoRouter.put(
	'/:id/file',
	multer().single('file'),
	[check('id').notEmpty().isUUID()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		let result = await photoService
			.updateFile(req.params.id, req.file.buffer)
			.then((item) => item)
			.catch((err) => {
				//console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});
		let thumbnail = await createThumbnail(req.file.buffer);
		result = await photoService.updateThumbFile(req.params.id, thumbnail);

		return res.json({ data: result });
	}
);

photoRouter.post(
	'/saved-filter',
	[
		body('userId').notEmpty().isInt(),
		body('name').notEmpty().bail().isString(),
		body('resultType').notEmpty().bail().isString(),
		body('value').notEmpty().bail().isString(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await photoService
			.addSavedFilter(req.body as SavedFilter)
			.then((item) => item)
			.catch((err) => {
				//console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
	}
);

photoRouter.delete(
	'/saved-filter/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		let list = await photoService.deleteSavedFilter(parseInt(id));
		return res.json({ data: list });
	}
);

photoRouter.get(
	'/saved-filter/:id',
	[check('id').notEmpty().isInt()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		await photoService
			.getSavedFilter(req.params.id)
			.then((item) => {
				if (item) return res.json({ data: item });

				return res.status(404).send('Filter not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Filter not found');
			});
	}
);

photoRouter.get(
	'/saved-filter/user/:id',
	[check('id').notEmpty().isInt()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		await photoService
			.getSavedFilterByUser(req.params.id)
			.then((item) => {
				if (item) return res.json({ data: item });

				return res.status(404).send('Filters not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Filters not found');
			});
	}
);
