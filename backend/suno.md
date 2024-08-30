Here is the markdown documentation based on your findings:

# API Calls Documentation for Suno Studio

## Generate API Call

### Request
```bash
curl 'https://studio-api.suno.ai/api/generate/v2/' \
  -H 'authority: studio-api.suno.ai' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'affiliate-id: undefined' \
  -H 'authorization: Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3MTgxNjc3NzgsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvY2xlcmtfaWQiOiJ1c2VyXzJmcWlvNHlQZm91QmJtU3BBNjZDNFVnS0FUSiIsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvZW1haWwiOiJtb3VzdGFmYWVsaGFkYXJ5OTZAZ21haWwuY29tIiwiaWF0IjoxNzE4MTY3NzE4LCJpc3MiOiJodHRwczovL2NsZXJrLnN1bm8uY29tIiwianRpIjoiYTFkZmJkYjgyZTE0NWFmMTFhZmUiLCJuYmYiOjE3MTgxNjc3MDgsInNpZCI6InNlc3NfMmhsSmpTcnZOdVFScXU0WjFEU29maVNLMFBEIiwic3ViIjoidXNlcl8yZnFpbzR5UGZvdUJibVNwQTY2QzRVZ0tBVEoifQ.cgIdzJhrOu7lC49mjyL4nAINPviu36pC0Hxb4DT5ZIztp-csWc9MitVeGcWch3UGGLrHdLMy8ZWeAGMu-BRvSukmlzrxKoKHgQVR6XGz2DHOPpoNAuYeE_KlNPb8CO79zVHnZredvVMcQupUl9kvRIZBu2NR57HfoatuVsHeknQqMdJEPkFWct3vrmKyjhrg5mU2_3H1pKIkwZO_zJNPKHnD3yWNMoj_vfmd_kiJgNU37-unYk1bCqdzxnkd2oGX3A1lxUXouoI95Dzy3eASnNtbn3x_Uhln0tWZWAKnzrHmdzIgTa7HUqgzmajc2Dr1r8Nq6c5ZryYjJv2j2m8liw' \
  -H 'content-type: text/plain;charset=UTF-8' \
  -H 'origin: https://suno.com' \
  -H 'referer: https://suno.com/' \
  -H 'sec-ch-ua: "Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: "Android"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' \
  --data-raw '{"gpt_description_prompt":"An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz","mv":"chirp-v3-5","prompt":"","make_instrumental":false}' \
  --compressed
```

### Request Payload
```json
{
    "gpt_description_prompt": "An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz",
    "mv": "chirp-v3-5",
    "prompt": "",
    "make_instrumental": false
}
```

### Response
```json
{
    "id": "9ae0df67-ca1d-484b-ad99-1b1c117f4ee7",
    "clips": [
        {
            "id": "3e02cf5b-296b-4c68-b78b-b008f0ed2414",
            "video_url": "",
            "audio_url": "",
            "image_url": null,
            "image_large_url": null,
            "is_video_pending": false,
            "major_model_version": "v3",
            "model_name": "chirp-v3",
            "metadata": {
                "tags": null,
                "prompt": "",
                "gpt_description_prompt": "An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz",
                "audio_prompt_id": null,
                "history": null,
                "concat_history": null,
                "type": "gen",
                "duration": null,
                "refund_credits": null,
                "stream": true,
                "infill": null,
                "has_vocal": null,
                "is_audio_upload_tos_accepted": null,
                "error_type": null,
                "error_message": null
            },
            "is_liked": false,
            "user_id": "f88cf838-ec4b-48d1-bff7-bdbfdef98763",
            "display_name": "Moustafa",
            "handle": "moustafa",
            "is_handle_updated": true,
            "avatar_image_url": null,
            "is_trashed": false,
            "reaction": null,
            "created_at": "2024-06-12T04:48:39.077Z",
            "status": "submitted",
            "title": "",
            "play_count": 0,
            "upvote_count": 0,
            "is_public": false
        },
        {
            "id": "3bd0348c-0b92-46ce-9f6a-492cdde62582",
            "video_url": "",
            "audio_url": "",
            "image_url": null,
            "image_large_url": null,
            "is_video_pending": false,
            "major_model_version": "v3",
            "model_name": "chirp-v3",
            "metadata": {
                "tags": null,
                "prompt": "",
                "gpt_description_prompt": "An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz",
                "audio_prompt_id": null,
                "history": null,
                "concat_history": null,
                "type": "gen",
                "duration": null,
                "refund_credits": null,
                "stream": true,
                "infill": null,
                "has_vocal": null,
                "is_audio_upload_tos_accepted": null,
                "error_type": null,
                "error_message": null
            },
            "is_liked": false,
            "user_id": "f88cf838-ec4b-48d1-bff7-bdbfdef98763",
            "display_name": "Moustafa",
            "handle": "moustafa",
            "is_handle_updated": true,
            "avatar_image_url": null,
            "is_trashed": false,
            "reaction": null,
            "created_at": "2024-06-12T04:48:39.078Z",
            "status": "submitted",
            "title": "",
            "play_count": 0,
            "upvote_count": 0,
            "is_public": false
        }
    ],
    "metadata": {
        "tags": null,
        "prompt": "",
        "gpt_description_prompt": "An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz",
        "audio_prompt_id": null,
        "history": null,
        "concat_history": null,
        "type": "gen",
        "duration": null,
        "refund_credits": null,
        "stream": true,
        "infill": null,
        "has_vocal": null,
        "is_audio_upload_tos_accepted": null,
        "error_type": null,
        "error_message": null
    },
    "major_model_version": "v3",
    "status": "complete",
    "created_at": "2024-06-12T04:48:39.068Z",
    "batch_size": 1
}
```

## Feed API Call

### Request
```bash
curl 'https://studio-api.suno.ai/api/feed/?ids=3e02cf5b-296b-4c68-b78b-b008f0ed2414%2C3bd0348c-0b92-46ce-9f6a-492cdde62582' \
  -H 'authority: studio-api.suno.ai' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'affiliate-id: undefined' \
  -H 'authorization: Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3MTgxNjc3NzgsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvY2xlcmtfaWQiOiJ1c2VyXzJmcWlvNHlQZm91QmJtU3BBNjZDNFVnS0FUSiIsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvZW1haWwiOiJtb3VzdGFmYWVsaGFkYXJ5OTZAZ21haWwuY29tIiwiaWF0IjoxNzE4MTY3NzE4LCJpc3MiOiJodHRwczovL2NsZXJrLnN1bm8uY29tIiwianRpIjoiYTFkZmJkYjgyZTE0NWFmMTFhZmUiLCJuYmYiOjE3MTgxNjc3MDgsInNpZCI6InNlc3NfMmhsSmpTcnZOdVFScXU0WjFEU29maVNLMFBEIiwic3ViIjoidXNlcl8yZnFpbzR5UGZvdUJibVNwQTY2QzRVZ0tBVEoifQ.cgIdzJhrOu7lC49mjyL4nAINPviu36pC0Hxb4DT5ZIztp-csWc9MitVeGcWch3UGGLrHdLMy8ZWeAGMu-BRvSukmlzrxKoKHgQVR6XGz2DHOPpoNAuYeE_KlNPb8CO79zVHnZredvVMcQupUl9kvRIZBu2NR57HfoatuVsHeknQqMdJEPkFWct3vrmKyjhrg5mU2_3H1pKIkwZO_zJNPKHnD3yWNMoj_vfmd_kiJgNU37-unYk1bCqdzxnkd2oGX3A1lxUXouoI95Dzy3eASnNtbn3x_Uhln0tWZWAKnzrHmdzIgTa7HUqgzmajc2Dr1r8Nq6c5ZryYjJv2j2m8liw' \
  -H 'origin: https://suno.com' \
  -H 'referer: https://suno.com/' \
  -H 'sec-ch-ua: "Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: "Android"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' \
  --compressed
```

### Response 
```json
[
    {
        "id": "3e02cf5b-296b-4c68-b78b-b008f0ed2414",
        "video_url": "",
        "audio_url": "",
        "image_url": null,
        "image_large_url": null,
        "is_video_pending": false,
        "major_model_version": "v3.5",
        "model_name": "chirp-v3.5",
        "metadata": {
            "tags": "rhythmic fusion pop",
            "prompt": "[Verse]\nفي ميامي الشواطئ\nتراها في الظلام\nالنجوم في السما\nتلمع مثل الجمال\n\n[Verse 2]\nНаправляемся на солнце\nГород наш\nМиами\nСафиназ\nДевочка\nТвоя звезда в душе\n\n[Chorus]\nM-I-A-M-I\nفي ميامي نحن هنا\nСафиназ\nМы празднуем\nConsulting dreams\nShine on\n\n[Bridge]\nСоветы для успеха\nلكم يا أصدقائي\nНад облаками вместе\nFly high Safinaz\n\n[Verse 3]\nفي هذا اليوم، عيدك\nСамый лучший день\nاستشارة ورأيك\nИнсайты в каждый миг\n\n[Chorus]\nM-I-A-M-I\nفي ميامي نحن هنا\nСафиназ\nМы празднуем\nConsulting dreams\nShine on",
            "gpt_description_prompt": "An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz",
            "audio_prompt_id": null,
            "history": null,
            "concat_history": null,
            "type": "gen",
            "duration": null,
            "refund_credits": null,
            "stream": true,
            "infill": null,
            "has_vocal": null,
            "is_audio_upload_tos_accepted": null,
            "error_type": null,
            "error_message": null
        },
        "is_liked": false,
        "user_id": "f88cf838-ec4b-48d1-bff7-bdbfdef98763",
        "display_name": "Moustafa",
        "handle": "moustafa",
        "is_handle_updated": true,
        "avatar_image_url": null,
        "is_trashed": false,
        "reaction": null,
        "created_at": "2024-06-12T04:48:39.077Z",
        "status": "queued",
        "title": "Miami Vibes for Safinaz",
        "play_count": 0,
        "upvote_count": 0,
        "is_public": false
    },
    {
        "id": "3bd0348c-0b92-46ce-9f6a-492cdde62582",
        "video_url": "",
        "audio_url": "",
        "image_url": "https://cdn1.suno.ai/image_3bd0348c-0b92-46ce-9f6a-492cdde62582.png",
        "image_large_url": "https://cdn1.suno.ai/image_large_3bd0348c-0b92-46ce-9f6a-492cdde62582.png",
        "is_video_pending": false,
        "major_model_version": "v3.5",
        "model_name": "chirp-v3.5",
        "metadata": {
            "tags": "rhythmic fusion pop",
            "prompt": "[Verse]\nفي ميامي الشواطئ\nتراها في الظلام\nالنجوم في السما\nتلمع مثل الجمال\n\n[Verse 2]\nНаправляемся на солнце\nГород наш\nМиами\nСафиназ\nДевочка\nТвоя звезда в душе\n\n[Chorus]\nM-I-A-M-I\nفي ميامي نحن هنا\nСафиназ\nМы празднуем\nConsulting dreams\nShine on\n\n[Bridge]\nСоветы для успеха\nلكم يا أصدقائي\nНад облаками вместе\nFly high Safinaz\n\n[Verse 3]\nفي هذا اليوم، عيدك\nСамый лучший день\nاستشارة ورأيك\nИнсайты в каждый миг\n\n[Chorus]\nM-I-A-M-I\nفي ميامي نحن هنا\nСафиназ\nМы празднуем\nConsulting dreams\nShine on",
            "gpt_description_prompt": "An arabic russian fusion song about miami and consulting for my sisters birthday, her name is safinaz",
            "audio_prompt_id": null,
            "history": null,
            "concat_history": null,
            "type": "gen",
            "duration": null,
            "refund_credits": null,
            "stream": true,
            "infill": null,
            "has_vocal": null,
            "is_audio_upload_tos_accepted": null,
            "error_type": null,
            "error_message": null
        },
        "is_liked": false,
        "user_id": "f88cf838-ec4b-48d1-bff7-bdbfdef98763",
        "display_name": "Moustafa",
        "handle": "moustafa",
        "is_handle_updated": true,
        "avatar_image_url": null,
        "is_trashed": false,
        "reaction": null,
        "created_at": "2024-06-12T04:48:39.078Z",
        "status": "queued",
        "title": "Miami Vibes for Safinaz",
        "play_count": 0,
        "upvote_count": 0,
        "is_public": false
    }
]
```

This document provides details on how to make requests to the Suno Studio API and includes example payloads and responses for the `/api/generate/v2/` and `/api/feed/` endpoints. Adjust and extend the response sections with actual data if available.