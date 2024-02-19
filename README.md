This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Environment Variable

You can find all environment variables in the file **".env.example"**.

### Server Side env variables

For API service:

- **POSTGRES_URL** :
- **POSTGRES_PRISMA_URL** :
- **POSTGRES_URL_NON_POOLING** :

- **API_CHAPTER_RANDOM_MIN_COUNT** : Return the min count chapters info, default is 3 in the code
- **API_CHAPTER_RANDOM_MAX_COUNT** : Setup the max count chapters info,default is 10 in the code
- **API_CHAPTER_UP_WITH_SELF_DEPTH** : Gets the section from itself and up to the specified depth, default is 3 in the code
- **API_CHAPTER_RELATIONSHIP_MAX_LIMIT** : Return limite count chapters mode info, default is 10000
- **API_DEFAULT_WALLET_ADDRESS** ：Setup the default wallet address

- **METADATA_BASE**: is a convenience option to set a base URL prefix for metadata fields that require a fully qualified URL. [Detail](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase)

For IP Asset:

- **NEXT_PUBLIC_QR_CODE_TV** ：Setup the QR code address
- **NEXT_PUBLIC_LEARN_STORY_PROTOCOL_LINK** ：Setup the learn story protocol link
- **RPC_URL** ：
- **PRIVATE_KEY** ：
- **IP_ORG_ID** ：
- **UPLOAD_TOTAL** ：
- **UPLOAD_INTERVAL** ：
- **NEXT_PUBLIC_API_BASE_URL** ：
- **NEXT_PUBLIC_STORY_PROTOCOL_CONTRACT** ：
- **NEXT_PUBLIC_IP_ASSET_REGISTRY_CONTRACT** ：
- **NEXT_PUBLIC_IP_ORG_CONTROLLER_CONTRACT** ：
- **NEXT_PUBLIC_RELATIONSHIP_MODULE_CONTRACT** ：
- **NEXT_PUBLIC_REGISTRATION_MODULE_CONTRACT** ：
- **NEXT_PUBLIC_LICENSE_REGISTRY_CONTRACT** ：
- **NEXT_PUBLIC_MODULE_REGISTRY_CONTRACT** ：
- **NEXT_PUBLIC_LICENSE_FRAMEWORK_REPO_CONTRACT** ：
- **NEXT_PUBLIC_LICENSE_MODULE_CONTRACT** ：

## Cron Job

### Extend Cron Jobs

1. Wrap your task into a GET function and default export it if necessary.
2. Register your cron job in the `/vercel.json`
   - make sure the `path` field points to the file where contains the cron job
   - `schedule` specifies cron job expression, that specifies the period of the cron job

Note:

- [Learn more about Vercel Cron Job](https://vercel.com/docs/cron-jobs)
- [Learn more about Cron Job Expressions](https://cron-template.vercel.app/)

## Database

### Table Define

```sql
-- public.story definition
CREATE TABLE public.story (
	id bigserial NOT NULL,
	"name" varchar NOT NULL DEFAULT 'give me a name'::character varying,
	cover_img varchar NULL,
	credential uuid NOT NULL,
	created_at int8 NOT NULL,
	CONSTRAINT story_pk PRIMARY KEY (id),
	CONSTRAINT story_unique UNIQUE (credential)
);

-- public.chapter definition
CREATE TABLE public.chapter (
	id bigserial NOT NULL,
	story_id int8 NOT NULL,
	"content" varchar NOT NULL,
	wallet_address varchar NOT NULL DEFAULT ''::character varying,
	"level" int8 NOT NULL,
	"path" _int8 NULL,
	is_anonymous bool NOT NULL DEFAULT true,
	parent_id int8 NOT NULL,
	credential uuid NOT NULL,
	created_at int8 NOT NULL,
	CONSTRAINT chapter_pk PRIMARY KEY (id),
	CONSTRAINT chapter_unique UNIQUE (credential)
);

-- public.ip_asset definition
CREATE TABLE public.ip_asset (
	id bigserial NOT NULL,
	credential uuid NOT NULL,
	"name" varchar NOT NULL,
	"type" int4 NOT NULL DEFAULT 1,
	description varchar NOT NULL DEFAULT ''::character varying,
	belong_to varchar NOT NULL DEFAULT ''::character varying,
	metadata_url varchar NULL,
	asset_seq_id int8 NULL,
	tx_hash varchar NULL,
	status int2 NOT NULL DEFAULT 0,
	created_at int8 NOT NULL,
	CONSTRAINT ip_asset_pk PRIMARY KEY (id),
	CONSTRAINT ip_asset_unique UNIQUE (credential)
);

-- public.relationship definition
CREATE TABLE public.relationship (
	id bigserial NOT NULL,
	relationship_type varchar NOT NULL DEFAULT 'PREVIOUS_CHAPTER'::character varying,
	src_asset_id uuid NOT NULL,
	dst_asset_id uuid NOT NULL,
	relationship_seq_id varchar NULL,
	tx_hash varchar NULL,
	status int2 NOT NULL DEFAULT 0,
	created_at int8 NOT NULL,
	CONSTRAINT relationship_pk PRIMARY KEY (id),
	CONSTRAINT relationship_unique UNIQUE (src_asset_id, dst_asset_id)
);

-- public.upload_data_statistics definition
CREATE TABLE public.upload_data_statistics (
	id uuid NOT NULL DEFAULT 'a22259f5-2d19-4132-a521-53b9f87fde55'::uuid,
	last_upload_time int8 NOT NULL DEFAULT 0,
	total_upload_story int8 NOT NULL DEFAULT 0,
	total_upload_chapter int8 NOT NULL DEFAULT 0,
	total_upload_relationship int8 NOT NULL DEFAULT 0,
	CONSTRAINT upload_data_statistics_pk PRIMARY KEY (id)
);
```

### Test Data

---

#### 1. Story and chapter

```sql
-- 10 stories
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(1, 'test story 1', '', 'bb04fb60-e2b4-4fc0-abaf-0787494ee7a6'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(2, 'test story 2', '', 'dcd83ac9-5d02-40ce-bcfb-c29a7a308ee4'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(3, 'test story 3', '', '9a90f193-a2f4-457e-ae71-33f0f47e1971'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(4, 'test story 4', '', '0dbe3ed3-0b62-4ab7-a44c-7f39568c9122'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(5, 'test story 5', '', '81a561bf-b4cd-408a-8ea1-4b812d4e5736'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(6, 'test story 6', '', '4fff6995-73b5-491d-8583-165ab7aa8258'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(7, 'test story 7', '', '810b7da3-b94b-4eed-bca1-13fc8cc29906'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(8, 'test story 8', '', '1b10afe2-b701-4519-8529-927e5d065e85'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(9, 'test story 9', '', 'e894528f-30f3-4a80-8dae-320a080247ef'::uuid, 1707035242);
INSERT INTO public.story
(id, "name", cover_img, credential, created_at)
VALUES(10, 'test story 9', '', 'ec4c891d-5f56-45bd-9485-575137c5a730'::uuid, 1707035242);

SELECT setval('public.story_id_seq', (SELECT MAX(id) FROM public.story));

-- The 1st chapter for each stories
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(1, 1, 'I''m a speaker of story 1', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, 'a22259f5-2d19-4132-a521-53b9f87fde55'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(2, 2, 'I''m a speaker of story 2', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, '8a6a49a9-5a19-4ec5-a98b-c1f04e7b6e7f'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(3, 3, 'I''m a speaker of story 3', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, 'de508061-1a26-414a-880f-dd3873f2e458'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(4, 4, 'I''m a speaker of story 4', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, '7f572aba-cf65-4eeb-9341-673cef0623a0'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(5, 5, 'I''m a speaker of story 5', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, '8d734bcb-fb0d-4121-b063-3c201abf3ac5'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(6, 6, 'I''m a speaker of story 6', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, 'f90b3835-f7fb-44c0-9abe-cdd396d019b2'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(7, 7, 'I''m a speaker of story 7', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, '89c3677e-b187-4bb1-acfb-8b8183bed7f7'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(8, 8, 'I''m a speaker of story 8', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, 'ee2ebc6e-569b-4ec2-999a-bdb51946f231'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(9, 9, 'I''m a speaker of story 9', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, 'ee7b7310-e723-4cc8-b8ac-4cb30ee17464'::uuid, 1707035242000);
INSERT INTO public.chapter
(id, story_id, "content", wallet_address, "level", "path", is_anonymous, parent_id, credential, created_at)
VALUES(10, 10, 'I''m a speaker of story 10', '0x95CCD7B2795894C57075F878C2993953F51EB734', 1, '{}', true, 0, '9d1e8408-94da-4b89-af91-9f2eb88918f5'::uuid, 1707035242000);

SELECT setval('public.chapter_id_seq', (SELECT MAX(id) FROM public.chapter));
```

---

#### 2. IP Asset and Relationship data for the initial story and chapter

```sql
-- For story
INSERT INTO public.ip_asset (credential,"name","type",description,belong_to,status,created_at) VALUES
	 ('bb04fb60-e2b4-4fc0-abaf-0787494ee7a6','test story 1',0,'','',0,1707035242),
	 ('dcd83ac9-5d02-40ce-bcfb-c29a7a308ee4','test story 2',0,'','',0,1707035242),
	 ('9a90f193-a2f4-457e-ae71-33f0f47e1971','test story 3',0,'','',0,1707035242),
	 ('0dbe3ed3-0b62-4ab7-a44c-7f39568c9122','test story 4',0,'','',0,1707035242),
	 ('81a561bf-b4cd-408a-8ea1-4b812d4e5736','test story 5',0,'','',0,1707035242),
	 ('4fff6995-73b5-491d-8583-165ab7aa8258','test story 6',0,'','',0,1707035242),
	 ('810b7da3-b94b-4eed-bca1-13fc8cc29906','test story 7',0,'','',0,1707035242),
	 ('1b10afe2-b701-4519-8529-927e5d065e85','test story 8',0,'','',0,1707035242),
	 ('e894528f-30f3-4a80-8dae-320a080247ef','test story 9',0,'','',0,1707035242),
	 ('ec4c891d-5f56-45bd-9485-575137c5a730','test story 10',0,'','',0,1707035242);

-- For chapter
INSERT INTO public.ip_asset (credential,"name","type",description,belong_to,status,created_at) VALUES
	 ('a22259f5-2d19-4132-a521-53b9f87fde55','s1_c1',1,'I''m a speaker of story 1','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('8a6a49a9-5a19-4ec5-a98b-c1f04e7b6e7f','s2_c2',1,'I''m a speaker of story 2','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('de508061-1a26-414a-880f-dd3873f2e458','s3_c3',1,'I''m a speaker of story 3','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('7f572aba-cf65-4eeb-9341-673cef0623a0','s4_c4',1,'I''m a speaker of story 4','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('8d734bcb-fb0d-4121-b063-3c201abf3ac5','s5_c5',1,'I''m a speaker of story 5','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('f90b3835-f7fb-44c0-9abe-cdd396d019b2','s6_c6',1,'I''m a speaker of story 6','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('89c3677e-b187-4bb1-acfb-8b8183bed7f7','s7_c7',1,'I''m a speaker of story 7','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('ee2ebc6e-569b-4ec2-999a-bdb51946f231','s8_c8',1,'I''m a speaker of story 8','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('ee7b7310-e723-4cc8-b8ac-4cb30ee17464','s9_c9',1,'I''m a speaker of story 9','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242),
	 ('9d1e8408-94da-4b89-af91-9f2eb88918f5','s10_c10',1,'I''m a speaker of story 10','0x95CCD7B2795894C57075F878C2993953F51EB734',0,1707035242);

-- For chapter
INSERT INTO public.relationship(relationship_type,src_asset_id,dst_asset_id,status,created_at) VALUES
	 ('APPEARS_IN','a22259f5-2d19-4132-a521-53b9f87fde55','bb04fb60-e2b4-4fc0-abaf-0787494ee7a6',0,1707035242),
	 ('APPEARS_IN','8a6a49a9-5a19-4ec5-a98b-c1f04e7b6e7f','dcd83ac9-5d02-40ce-bcfb-c29a7a308ee4',0,1707035242),
	 ('APPEARS_IN','de508061-1a26-414a-880f-dd3873f2e458','9a90f193-a2f4-457e-ae71-33f0f47e1971',0,1707035242),
	 ('APPEARS_IN','7f572aba-cf65-4eeb-9341-673cef0623a0','0dbe3ed3-0b62-4ab7-a44c-7f39568c9122',0,1707035242),
	 ('APPEARS_IN','8d734bcb-fb0d-4121-b063-3c201abf3ac5','81a561bf-b4cd-408a-8ea1-4b812d4e5736',0,1707035242),
	 ('APPEARS_IN','f90b3835-f7fb-44c0-9abe-cdd396d019b2','4fff6995-73b5-491d-8583-165ab7aa8258',0,1707035242),
	 ('APPEARS_IN','89c3677e-b187-4bb1-acfb-8b8183bed7f7','810b7da3-b94b-4eed-bca1-13fc8cc29906',0,1707035242),
	 ('APPEARS_IN','ee2ebc6e-569b-4ec2-999a-bdb51946f231','1b10afe2-b701-4519-8529-927e5d065e85',0,1707035242),
	 ('APPEARS_IN','ee7b7310-e723-4cc8-b8ac-4cb30ee17464','e894528f-30f3-4a80-8dae-320a080247ef',0,1707035242),
	 ('APPEARS_IN','9d1e8408-94da-4b89-af91-9f2eb88918f5','ec4c891d-5f56-45bd-9485-575137c5a730',0,1707035242);
```
