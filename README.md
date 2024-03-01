This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Follow below procedures to install all necessary dependencies

```bash
	brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

- install nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# or
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

- switch to node V20

```bash
nvm use 20
```

- install node dependencies

```bash
npm i
```

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

Please clear all old data if you have old data in the database:

```sql
TRUNCATE table public.story RESTART identity;
TRUNCATE table public.chapter RESTART identity;

TRUNCATE table public.ip_asset RESTART identity;
TRUNCATE table public.relationship RESTART identity;
TRUNCATE table public.upload_data_statistics RESTART identity;
```

#### 1. Story and chapter

```sql
-- 19 stories
INSERT INTO public.story (id,"name",cover_img,credential,created_at) VALUES
	 (1,'test story 1','','bb04fb60-e2b4-4fc0-abaf-0787494ee7a6',1707035242),
	 (2,'test story 2','','dcd83ac9-5d02-40ce-bcfb-c29a7a308ee4',1707035242),
	 (3,'test story 3','','9a90f193-a2f4-457e-ae71-33f0f47e1971',1707035242),
	 (4,'test story 4','','0dbe3ed3-0b62-4ab7-a44c-7f39568c9122',1707035242),
	 (5,'test story 5','','81a561bf-b4cd-408a-8ea1-4b812d4e5736',1707035242),
	 (6,'test story 6','','4fff6995-73b5-491d-8583-165ab7aa8258',1707035242),
	 (7,'test story 7','','810b7da3-b94b-4eed-bca1-13fc8cc29906',1707035242),
	 (8,'test story 8','','1b10afe2-b701-4519-8529-927e5d065e85',1707035242),
	 (9,'test story 9','','e894528f-30f3-4a80-8dae-320a080247ef',1707035242),
	 (10,'test story 9','','ec4c891d-5f56-45bd-9485-575137c5a730',1707035242);
INSERT INTO public.story (id,"name",cover_img,credential,created_at) VALUES
	 (11,'test story 11','','9086584e-e704-4354-a910-42f20022a1ad',1707035242),
	 (13,'test story 13','','4b6a9162-cf71-4b70-8d08-2bda20646d51',1707035242),
	 (14,'test story 14','','4e584fcb-fe82-4e52-97ed-50e536ae2015',1707035242),
	 (15,'test story 15','','e57fa447-b284-4452-80ff-f24f7bea4aa8',1707035242),
	 (16,'test story 16','','c4946351-4589-41cc-a659-160b43d7701a',1707035242),
	 (17,'test story 17','','5cbc5e52-1f2a-4cb4-89ba-05363dbf24bb',1707035242),
	 (18,'test story 18','','48cc9133-c856-4f30-aed8-0f0cae66eaf6',1707035242),
	 (19,'test story 19','','209d3a9e-d29a-494b-839b-2e2dc02e0576',1707035242),
	 (20,'test story 20','','212e7fc6-8ab8-4984-913c-90de8d2239b1',1707035242);

SELECT setval('public.story_id_seq', (SELECT MAX(id) FROM public.story));

-- The 1st chapter for each stories
INSERT INTO public.chapter (id,story_id,has_child,"content",wallet_address,"level","path",is_anonymous,parent_id,credential,created_at) VALUES
	 (1,1,false,'My phone buzzed with a text from Jamie and my heart skipped as usual — until I remembered we''d buried her just yesterday. Her message, a chilling plea: It''s dark here. They''re watching. Please help.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'a22259f5-2d19-4132-a521-53b9f87fde55',1707035242000),
	 (2,2,false,'A pound at the door rips me awake. Red and blue lights flash through the windows. How long was I out?
       "Police! Open up!"
       I jump from the couch, reach for the door — and see my hand is covered in blood.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'8a6a49a9-5a19-4ec5-a98b-c1f04e7b6e7f',1707035242000),
	 (3,3,false,'In the drawing room, the silence was shattered by a scream. The candlestick, missing; the millionaire, dead; the suspects, all too close.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'de508061-1a26-414a-880f-dd3873f2e458',1707035242000),
	 (4,4,false,'We''re halfway down the long dirt driveway when we see the oncoming headlights. It''s a cop car, they want us to stop. Mom rolls down the window.
       "Evening, ma''am," says the driverside officer, whose too-big shirt has blood on the sleeve.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'7f572aba-cf65-4eeb-9341-673cef0623a0',1707035242000),
	 (5,5,false,'Jenna and Lucas spot a flag of red fabric in the leaves. Pushing the foliage aside, they uncover a pale, lifeless hand. In that instant, the forest''s dark secret is theirs, and the air turns cold with realization.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'8d734bcb-fb0d-4121-b063-3c201abf3ac5',1707035242000),
	 (6,6,false,'The lights inside the abandoned spacecraft flicker. A shadow darts across the bridge.
        "Someone''s here."
        The comms stutter to life. An SOS message plays.
','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'f90b3835-f7fb-44c0-9abe-cdd396d019b2',1707035242000),
	 (7,7,false,'He''s got a gun, and every word he spits is a live wire, sparking fear. Outside, the wait is a powder keg, and I''m caught in the middle.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'89c3677e-b187-4bb1-acfb-8b8183bed7f7',1707035242000),
	 (8,8,false,'It wasn''t until he was already in her car that she realized the hitchhiker''s smile didn''t quite reach his eyes. When her gaze flicked to the rearview mirror, she noticed his bag, slightly open, revealing a collection of driver''s licenses—none of them his.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'ee2ebc6e-569b-4ec2-999a-bdb51946f231',1707035242000),
	 (9,9,false,'The day I turned 21, I received a mysterious package with no sender: a sleek, black device that promised to delete a single memory. I knew exactly which night I wanted to forget, but some memories have teeth, and they bite back…','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'ee7b7310-e723-4cc8-b8ac-4cb30ee17464',1707035242000),
	 (10,10,false,'The last crew lost contact with Earth at dawn. By dusk, their airlocks began to open by themselves, not to the barren landscape, but to an impossibly green jungle teeming with eyes that watched from the shadows.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'9d1e8408-94da-4b89-af91-9f2eb88918f5',1707035242000);
INSERT INTO public.chapter (id,story_id,has_child,"content",wallet_address,"level","path",is_anonymous,parent_id,credential,created_at) VALUES
	 (11,11,false,'My GPS narrates, "In 300 feet, turn left into existential despair." I''m not sure if it''s a bug or a feature, but I''m pretty sure I''ve got to find out where it''s taking me next.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'72e625fd-9aaf-4d80-b79a-0464653df935',1707035242000),
	 (13,13,false,'Under the stars, she whispered, "Ever dance in the rain?" Just then, a drop fell, challenging him to make a move.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'1f5ce266-7810-46c4-bc39-249d0bd9d633',1707035242000),
	 (14,14,false,'As he fumbled with the old map, she laughed, taking it from his hands. "Let''s get lost together," she said, eyes sparkling with mischief.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'f7c8ddc1-42d1-45d8-bf13-d7fca2926796',1707035242000),
	 (15,15,false,'There once was a pirate with a fear of the sea, who sailed on land in a boat pulled by three. With a parrot that quacked, and a compass that cracked, he searched for treasure ‘neath every tree.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'9b247416-a87d-49cf-8d56-85fe25d2d78d',1707035242000),
	 (16,16,false,'Across the bright buzz of a city that won''t sleep, prowls Neon Fang, whose silence creeps. With eyes like the glow of hazardous waste, she''s out seeking prey, moving with haste.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'260ffbe7-f372-46ab-886c-f0fbadb9d644',1707035242000),
	 (17,17,false,'Just realized I''ve been using my calculator app during Zoom meetings instead of the chat.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'df1aceef-3e67-4dfe-8661-f3720abeb60e',1707035242000),
	 (18,18,false,'Accidentally opened a front camera and ended up starring in my own horror movie. I''ve got the perfect title for it, too…','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'9070c318-a044-4620-aeb0-6b91c091090c',1707035242000),
	 (19,19,false,'Across the silent sea, their ship sailed towards the horizon''s edge. "To find the beginning, seek the end," the map whispered.','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'82e2b8ba-09a9-44d5-91b6-fd94aa9ee663',1707035242000),
	 (20,20,false,'In the heart of the forest, he summoned the ancient spirit. "Your quest begins," the spirit breathed, then vanished. Now… which path to choose?','0x95CCD7B2795894C57075F878C2993953F51EB734',1,'{}',true,0,'4adfab37-e6a6-42b3-9c26-1fa0d1ae4b3a',1707035242000);

SELECT setval('public.chapter_id_seq', (SELECT MAX(id) FROM public.chapter));
```

---

#### 2. IP Asset and Relationship data for the initial story and chapter

```sql
-- For story
INSERT INTO public.ip_asset (credential,"name","type",description,belong_to,metadata_url,asset_seq_id,tx_hash,status,created_at) VALUES
	 ('bb04fb60-e2b4-4fc0-abaf-0787494ee7a6','test story 1',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('dcd83ac9-5d02-40ce-bcfb-c29a7a308ee4','test story 2',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('9a90f193-a2f4-457e-ae71-33f0f47e1971','test story 3',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('0dbe3ed3-0b62-4ab7-a44c-7f39568c9122','test story 4',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('81a561bf-b4cd-408a-8ea1-4b812d4e5736','test story 5',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('4fff6995-73b5-491d-8583-165ab7aa8258','test story 6',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('810b7da3-b94b-4eed-bca1-13fc8cc29906','test story 7',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('1b10afe2-b701-4519-8529-927e5d065e85','test story 8',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('e894528f-30f3-4a80-8dae-320a080247ef','test story 9',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('ec4c891d-5f56-45bd-9485-575137c5a730','test story 10',0,'','',NULL,NULL,NULL,0,1707035242);
INSERT INTO public.ip_asset (credential,"name","type",description,belong_to,metadata_url,asset_seq_id,tx_hash,status,created_at) VALUES
	 ('9086584e-e704-4354-a910-42f20022a1ad','test story 11',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('4b6a9162-cf71-4b70-8d08-2bda20646d51','test story 13',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('4e584fcb-fe82-4e52-97ed-50e536ae2015','test story 14',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('e57fa447-b284-4452-80ff-f24f7bea4aa8','test story 15',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('c4946351-4589-41cc-a659-160b43d7701a','test story 16',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('5cbc5e52-1f2a-4cb4-89ba-05363dbf24bb','test story 17',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('48cc9133-c856-4f30-aed8-0f0cae66eaf6','test story 18',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('209d3a9e-d29a-494b-839b-2e2dc02e0576','test story 19',0,'','',NULL,NULL,NULL,0,1707035242),
	 ('212e7fc6-8ab8-4984-913c-90de8d2239b1','test story 20',0,'','',NULL,NULL,NULL,0,1707035242);

-- For chapter
INSERT INTO public.ip_asset (credential,"name","type",description,belong_to,metadata_url,asset_seq_id,tx_hash,status,created_at) VALUES
	 ('a22259f5-2d19-4132-a521-53b9f87fde55','s1_c1',1,'My phone buzzed with a text from Jamie and my heart skipped as usual — until I remembered we''d buried her just yesterday. Her message, a chilling plea: It''s dark here. They''re watching. Please help.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('8a6a49a9-5a19-4ec5-a98b-c1f04e7b6e7f','s2_c2',1,'A pound at the door rips me awake. Red and blue lights flash through the windows. How long was I out?
       "Police! Open up!"
       I jump from the couch, reach for the door — and see my hand is covered in blood.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('de508061-1a26-414a-880f-dd3873f2e458','s3_c3',1,'In the drawing room, the silence was shattered by a scream. The candlestick, missing; the millionaire, dead; the suspects, all too close.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('7f572aba-cf65-4eeb-9341-673cef0623a0','s4_c4',1,'We''re halfway down the long dirt driveway when we see the oncoming headlights. It''s a cop car, they want us to stop. Mom rolls down the window.
       "Evening, ma''am," says the driverside officer, whose too-big shirt has blood on the sleeve.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('8d734bcb-fb0d-4121-b063-3c201abf3ac5','s5_c5',1,'Jenna and Lucas spot a flag of red fabric in the leaves. Pushing the foliage aside, they uncover a pale, lifeless hand. In that instant, the forest''s dark secret is theirs, and the air turns cold with realization.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('f90b3835-f7fb-44c0-9abe-cdd396d019b2','s6_c6',1,'The lights inside the abandoned spacecraft flicker. A shadow darts across the bridge.
        "Someone''s here."
        The comms stutter to life. An SOS message plays.
','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('89c3677e-b187-4bb1-acfb-8b8183bed7f7','s7_c7',1,'He''s got a gun, and every word he spits is a live wire, sparking fear. Outside, the wait is a powder keg, and I''m caught in the middle.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('ee2ebc6e-569b-4ec2-999a-bdb51946f231','s8_c8',1,'It wasn''t until he was already in her car that she realized the hitchhiker''s smile didn''t quite reach his eyes. When her gaze flicked to the rearview mirror, she noticed his bag, slightly open, revealing a collection of driver''s licenses—none of them his.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('ee7b7310-e723-4cc8-b8ac-4cb30ee17464','s9_c9',1,'The day I turned 21, I received a mysterious package with no sender: a sleek, black device that promised to delete a single memory. I knew exactly which night I wanted to forget, but some memories have teeth, and they bite back…','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('1f5ce266-7810-46c4-bc39-249d0bd9d633','s13_c13',1,'Under the stars, she whispered, "Ever dance in the rain?" Just then, a drop fell, challenging him to make a move.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242);
INSERT INTO public.ip_asset (credential,"name","type",description,belong_to,metadata_url,asset_seq_id,tx_hash,status,created_at) VALUES
	 ('9d1e8408-94da-4b89-af91-9f2eb88918f5','s10_c10',1,'The last crew lost contact with Earth at dawn. By dusk, their airlocks began to open by themselves, not to the barren landscape, but to an impossibly green jungle teeming with eyes that watched from the shadows.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('72e625fd-9aaf-4d80-b79a-0464653df935','s11_c11',1,'My GPS narrates, "In 300 feet, turn left into existential despair." I''m not sure if it''s a bug or a feature, but I''m pretty sure I''ve got to find out where it''s taking me next.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('f7c8ddc1-42d1-45d8-bf13-d7fca2926796','s14_c14',1,'As he fumbled with the old map, she laughed, taking it from his hands. "Let''s get lost together," she said, eyes sparkling with mischief.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('9b247416-a87d-49cf-8d56-85fe25d2d78d','s15_c15',1,'There once was a pirate with a fear of the sea, who sailed on land in a boat pulled by three. With a parrot that quacked, and a compass that cracked, he searched for treasure ‘neath every tree.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('260ffbe7-f372-46ab-886c-f0fbadb9d644','s16_c16',1,'Across the bright buzz of a city that won''t sleep, prowls Neon Fang, whose silence creeps. With eyes like the glow of hazardous waste, she''s out seeking prey, moving with haste.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('df1aceef-3e67-4dfe-8661-f3720abeb60e','s17_c17',1,'Just realized I''ve been using my calculator app during Zoom meetings instead of the chat.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('9070c318-a044-4620-aeb0-6b91c091090c','s18_c18',1,'Accidentally opened a front camera and ended up starring in my own horror movie. I''ve got the perfect title for it, too…','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('82e2b8ba-09a9-44d5-91b6-fd94aa9ee663','s19_c19',1,'Across the silent sea, their ship sailed towards the horizon''s edge. "To find the beginning, seek the end," the map whispered.','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242),
	 ('4adfab37-e6a6-42b3-9c26-1fa0d1ae4b3a','s20_c20',1,'In the heart of the forest, he summoned the ancient spirit. "Your quest begins," the spirit breathed, then vanished. Now… which path to choose?','0x95CCD7B2795894C57075F878C2993953F51EB734',NULL,NULL,NULL,0,1707035242);

-- For chapter
INSERT INTO public.relationship (relationship_type,src_asset_id,dst_asset_id,relationship_seq_id,tx_hash,status,created_at) VALUES
	 ('APPEARS_IN','a22259f5-2d19-4132-a521-53b9f87fde55','bb04fb60-e2b4-4fc0-abaf-0787494ee7a6',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','8a6a49a9-5a19-4ec5-a98b-c1f04e7b6e7f','dcd83ac9-5d02-40ce-bcfb-c29a7a308ee4',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','de508061-1a26-414a-880f-dd3873f2e458','9a90f193-a2f4-457e-ae71-33f0f47e1971',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','7f572aba-cf65-4eeb-9341-673cef0623a0','0dbe3ed3-0b62-4ab7-a44c-7f39568c9122',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','8d734bcb-fb0d-4121-b063-3c201abf3ac5','81a561bf-b4cd-408a-8ea1-4b812d4e5736',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','f90b3835-f7fb-44c0-9abe-cdd396d019b2','4fff6995-73b5-491d-8583-165ab7aa8258',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','89c3677e-b187-4bb1-acfb-8b8183bed7f7','810b7da3-b94b-4eed-bca1-13fc8cc29906',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','ee2ebc6e-569b-4ec2-999a-bdb51946f231','1b10afe2-b701-4519-8529-927e5d065e85',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','ee7b7310-e723-4cc8-b8ac-4cb30ee17464','e894528f-30f3-4a80-8dae-320a080247ef',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','9d1e8408-94da-4b89-af91-9f2eb88918f5','ec4c891d-5f56-45bd-9485-575137c5a730',NULL,NULL,0,1707035242);
INSERT INTO public.relationship (relationship_type,src_asset_id,dst_asset_id,relationship_seq_id,tx_hash,status,created_at) VALUES
	 ('APPEARS_IN','72e625fd-9aaf-4d80-b79a-0464653df935','9086584e-e704-4354-a910-42f20022a1ad',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','1f5ce266-7810-46c4-bc39-249d0bd9d633','4b6a9162-cf71-4b70-8d08-2bda20646d51',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','f7c8ddc1-42d1-45d8-bf13-d7fca2926796','4e584fcb-fe82-4e52-97ed-50e536ae2015',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','9b247416-a87d-49cf-8d56-85fe25d2d78d','e57fa447-b284-4452-80ff-f24f7bea4aa8',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','260ffbe7-f372-46ab-886c-f0fbadb9d644','c4946351-4589-41cc-a659-160b43d7701a',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','df1aceef-3e67-4dfe-8661-f3720abeb60e','5cbc5e52-1f2a-4cb4-89ba-05363dbf24bb',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','9070c318-a044-4620-aeb0-6b91c091090c','48cc9133-c856-4f30-aed8-0f0cae66eaf6',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','82e2b8ba-09a9-44d5-91b6-fd94aa9ee663','209d3a9e-d29a-494b-839b-2e2dc02e0576',NULL,NULL,0,1707035242),
	 ('APPEARS_IN','4adfab37-e6a6-42b3-9c26-1fa0d1ae4b3a','212e7fc6-8ab8-4984-913c-90de8d2239b1',NULL,NULL,0,1707035242);

-- Insert a default upload record(Required)
INSERT INTO public.upload_data_statistics(
	id, last_upload_time, total_upload_story, total_upload_chapter, total_upload_relationship)
	VALUES ('9ff3a877-fab6-4c64-ac3e-d4c4f333e5ff', 0, 0, 0, 0);
```
