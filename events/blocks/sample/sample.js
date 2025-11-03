/**
 * Standalone Vanilla JS Agenda Block
 * Behaves like Digital Agenda but with NO dependencies (no AEM, no Dexter, no React)
 * Can run anywhere - just include this JS file!
 */

// ============================================================================
// MOCK CHIMERA API RESPONSE - Matches real Chimera API structure
// Only returns 'cards' array, just like the real API
// ============================================================================
const MOCK_CHIMERA_API_RESPONSE = {
    "cards": [
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/opening-keynote-asl-mb1-1.html",
            "id": "855d2106-e809-3ffe-a51e-3b577d638220",
            "sortDate": "2022-10-18T16:00:00.000Z",
            "sessionTitle": "Opening Keynote - ASL",
            "sessionCode": "MB1-1",
            "sessionDuration": "120",
            "sessionEndTime": "2022-10-18T18:00:00.000Z",
            "sessionId": "1663262687110001amIV",
            "sessionStartTime": "2022-10-18T16:00:00.000Z",
            "sessionTimeId": "1663607410932001yZyz",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/opening-keynote-mb1.html",
            "id": "49ad652c-5641-310a-9bea-e2dba2b9c192",
            "sortDate": "2022-10-18T16:00:00.000Z",
            "sessionTitle": "Opening Keynote",
            "sessionCode": "MB1",
            "sessionDuration": "120",
            "sessionEndTime": "2022-10-18T18:00:00.000Z",
            "sessionId": "1655232069601001n7V8",
            "sessionStartTime": "2022-10-18T16:00:00.000Z",
            "sessionTimeId": "1657036758409001O9M5",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-using-adobe-xd-to-showcase-creative-workflows-s502.html",
            "id": "6f23fcd5-457b-302f-99c7-1fac05825e47",
            "sortDate": "2022-10-18T18:30:00.000Z",
            "sessionTitle": "Using Adobe XD to Showcase Creative Workflows",
            "sessionCode": "S502",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:00:00.000Z",
            "sessionId": "1651011983839001qZRh",
            "sessionStartTime": "2022-10-18T18:30:00.000Z",
            "sessionTimeId": "16566264368450016LzT",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-new-directions-in-readability-and-accessibilit-s200.html",
            "id": "a8b87048-a12e-3047-aa10-733922a37ab9",
            "sortDate": "2022-10-18T18:30:00.000Z",
            "sessionTitle": "New Directions in Readability and Accessibility",
            "sessionCode": "S200",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:00:00.000Z",
            "sessionId": "16491888615820015P5B",
            "sessionStartTime": "2022-10-18T18:30:00.000Z",
            "sessionTimeId": "1656626623862001hu2d",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/acrobat",
                    "title": "Acrobat"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/products/reader",
                    "title": "Reader"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-editing-videos-for-social-media-faster-using-p-s600.html",
            "id": "3b2f896f-4011-30ac-bcc7-0d87644abbcd",
            "sortDate": "2022-10-18T18:30:00.000Z",
            "sessionTitle": "Editing Videos for Social Media Faster Using Premiere Pro",
            "sessionCode": "S600",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:00:00.000Z",
            "sessionId": "1651011983925001qezf",
            "sessionStartTime": "2022-10-18T18:30:00.000Z",
            "sessionTimeId": "16566265690780016crx",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-graphic-design-al600.html",
            "id": "2d15f14a-146d-3392-8047-204169e58ffc",
            "sortDate": "2022-10-18T18:30:00.000Z",
            "sessionTitle": "First Takes from the Community: Graphic Design",
            "sessionCode": "AL600",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-18T19:15:00.000Z",
            "sessionId": "1658970158335001Hoiv",
            "sessionStartTime": "2022-10-18T18:30:00.000Z",
            "sessionTimeId": "1658972761222001W5Tj",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-become-a-selftaught-illustrator-design-concept-s309.html",
            "id": "6f1233ef-42fe-325f-91e9-6768310cbb8b",
            "sortDate": "2022-10-18T18:30:00.000Z",
            "sessionTitle": "Become a Self-Taught Illustrator: Design Concepts & Tools",
            "sessionCode": "S309",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:00:00.000Z",
            "sessionId": "1651011982964001q1Ha",
            "sessionStartTime": "2022-10-18T18:30:00.000Z",
            "sessionTimeId": "1656626597117001ZBHs",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-illustrations-with-adobe-fresco-and-c-s218.html",
            "id": "36798750-76a9-35cb-8198-b7d6b383ae6a",
            "sortDate": "2022-10-18T19:00:00.000Z",
            "sessionTitle": "Creating Illustrations with Adobe Fresco and Capture",
            "sessionCode": "S218",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:30:00.000Z",
            "sessionId": "1652999635323001jDIj",
            "sessionStartTime": "2022-10-18T19:00:00.000Z",
            "sessionTimeId": "1656628691962001Ziwa",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/capture",
                    "title": "Capture"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-enhancing-your-photos-and-designs-with-creativ-s456.html",
            "id": "10b4431e-c758-3edf-acf9-09daa5657db9",
            "sortDate": "2022-10-18T19:00:00.000Z",
            "sessionTitle": "Enhancing Your Photos and Designs with Creative Typography",
            "sessionCode": "S456",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:30:00.000Z",
            "sessionId": "1651011983687001qFXQ",
            "sessionStartTime": "2022-10-18T19:00:00.000Z",
            "sessionTimeId": "1656628176730001UX4T",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-ar-effects-with-adobe-and-tiktoks-effe-s715.html",
            "id": "205c8d5a-dfb5-3099-b009-dfc00f786bba",
            "isFeatured": true,
            "sortDate": "2022-10-18T19:00:00.000Z",
            "sessionTitle": "Creating AR Effects with Adobe and TikTok’s Effect House",
            "sessionCode": "S715",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:30:00.000Z",
            "sessionId": "16491888644540015ee5",
            "sessionStartTime": "2022-10-18T19:00:00.000Z",
            "sessionTimeId": "1659482500325001uiEM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-powerful-lightroom-color-tools-make-me-feel-li-s405.html",
            "id": "535f40b7-e4c0-3b7a-9aa8-ac727fe9036f",
            "sortDate": "2022-10-18T19:00:00.000Z",
            "sessionTitle": "Powerful Lightroom Color Tools Make Me Feel Like, WHOA!",
            "sessionCode": "S405",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T19:30:00.000Z",
            "sessionId": "1651011983349001qxnb",
            "sessionStartTime": "2022-10-18T19:00:00.000Z",
            "sessionTimeId": "1656653916025001UM4l",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-visuals-for-physical-and-ar-experienc-s102.html",
            "id": "503a66e6-06a9-332c-b0fa-d080e1d99388",
            "sortDate": "2022-10-18T19:30:00.000Z",
            "sessionTitle": "Creating Visuals for Physical and AR Experiences",
            "sessionCode": "S102",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:00:00.000Z",
            "sessionId": "1651011982361001q3HS",
            "sessionStartTime": "2022-10-18T19:30:00.000Z",
            "sessionTimeId": "1658957099384001Hgu6",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-optimizing-media-asset-management-supply-chain-s714.html",
            "id": "c3f8d8db-b3bc-3876-a4f2-673d6fee1a54",
            "isFeatured": true,
            "sortDate": "2022-10-18T19:30:00.000Z",
            "sessionTitle": "Optimizing Media Asset Management, Supply Chain Workflows",
            "sessionCode": "S714",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:00:00.000Z",
            "sessionId": "164918886442100150Xt",
            "sessionStartTime": "2022-10-18T19:30:00.000Z",
            "sessionTimeId": "1655758153529001mIIJ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/it",
                    "title": "IT"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/category/remote-work",
                    "title": "Remote Work"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-photography-al601.html",
            "id": "b3f199c2-34da-3ec6-a14f-d51731d0fc87",
            "sortDate": "2022-10-18T19:30:00.000Z",
            "sessionTitle": "First Takes from the Community: Photography",
            "sessionCode": "AL601",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-18T20:15:00.000Z",
            "sessionId": "1658970527582001Nn0O",
            "sessionStartTime": "2022-10-18T19:30:00.000Z",
            "sessionTimeId": "1658972978306001Htl3",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-inspiring-a-purposedriven-culture-and-workforc-s150.html",
            "id": "fc4f0d50-b8b7-38fb-ab84-072f7b71c9e4",
            "sortDate": "2022-10-18T19:30:00.000Z",
            "sessionTitle": "Inspiring a Purpose-Driven Culture and Workforce Engagement",
            "sessionCode": "S150",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:00:00.000Z",
            "sessionId": "1651011982432001qQG1",
            "sessionStartTime": "2022-10-18T19:30:00.000Z",
            "sessionTimeId": "16566287582440016DP8",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-photoshop-gamechanging-features-every-designer-s305.html",
            "id": "60f3e76d-e1d9-3239-916b-52496507a6d9",
            "sortDate": "2022-10-18T19:30:00.000Z",
            "sessionTitle": "Photoshop Game-Changing Features Every Designer Should Know",
            "sessionCode": "S305",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:00:00.000Z",
            "sessionId": "1651011982797001qOne",
            "sessionStartTime": "2022-10-18T19:30:00.000Z",
            "sessionTimeId": "1656629991828001IcwE",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-innovation-in-education-strategies-for-sustaina-s206.html",
            "id": "0bc53b8a-f42c-3ebc-9802-ce834f04bd0f",
            "sortDate": "2022-10-18T20:00:00.000Z",
            "sessionTitle": "Innovation in Education: Strategies for Sustainable Success",
            "sessionCode": "S206",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:30:00.000Z",
            "sessionId": "164918886177900157FP",
            "sessionStartTime": "2022-10-18T20:00:00.000Z",
            "sessionTimeId": "1656628826956001UaKG",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-making-your-social-media-videos-pop-with-color-s601.html",
            "id": "c9812ad2-8630-359e-b0e1-cbf42d49f72e",
            "sortDate": "2022-10-18T20:00:00.000Z",
            "sessionTitle": "Making Your Social Media Videos Pop with Color",
            "sessionCode": "S601",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:30:00.000Z",
            "sessionId": "1651011983966001qM2h",
            "sessionStartTime": "2022-10-18T20:00:00.000Z",
            "sessionTimeId": "1656654006228001Uo9a",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-race-cars-cameras-action-larry-chen-photography-s721.html",
            "id": "0b65ccfc-e6fd-340d-94f9-5818dc07d2fc",
            "isFeatured": true,
            "sortDate": "2022-10-18T20:00:00.000Z",
            "sessionTitle": "Race Cars, Cameras, Action! Larry Chen’s Photography Process",
            "sessionCode": "S721",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:30:00.000Z",
            "sessionId": "16515987176820016QR7",
            "sessionStartTime": "2022-10-18T20:00:00.000Z",
            "sessionTimeId": "1655758802535001r1g3",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-using-lightroom-for-mobile-to-take-and-enhance-s404.html",
            "id": "b1c1a5f6-d554-3665-ae3c-2328a0f72f56",
            "isFeatured": true,
            "sortDate": "2022-10-18T20:00:00.000Z",
            "sessionTitle": "Using Lightroom for mobile to Take and Edit your Best Photos Yet",
            "sessionCode": "S404",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T20:30:00.000Z",
            "sessionId": "1651011983304001qFCB",
            "sessionStartTime": "2022-10-18T20:00:00.000Z",
            "sessionTimeId": "1656628853955001h0YE",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-integrated-creation-a-fresh-approach-to-product-s6004.html",
            "id": "c12dc5f9-4cae-33a3-8a35-7aa63a0ab459",
            "isFeatured": true,
            "sortDate": "2022-10-18T20:00:00.000Z",
            "sessionTitle": "Integrated Creation: A Fresh Approach to Product Design",
            "sessionCode": "S6004",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-18T21:00:00.000Z",
            "sessionId": "16491890235550019fqv",
            "sessionStartTime": "2022-10-18T20:00:00.000Z",
            "sessionTimeId": "1662072776843001xD8T",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-the-newest-drawing-features-in-adobe-fresco-s215.html",
            "id": "d58ab1c6-8298-3c44-b243-5674e8eed2d8",
            "isFeatured": true,
            "sortDate": "2022-10-18T20:30:00.000Z",
            "sessionTitle": "The Newest Drawing Features in Adobe Fresco",
            "sessionCode": "S215",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:00:00.000Z",
            "sessionId": "1652999635214001j7x2",
            "sessionStartTime": "2022-10-18T20:30:00.000Z",
            "sessionTimeId": "1656630025362001UnXK",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-build-a-brand-using-stunning-graphics-i-s455.html",
            "id": "85219173-31e5-394b-8533-681005578419",
            "isFeatured": true,
            "sortDate": "2022-10-18T20:30:00.000Z",
            "sessionTitle": "How to Build a Brand Using Stunning Graphics in Adobe Express",
            "sessionCode": "S455",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:00:00.000Z",
            "sessionId": "1651011983651001q2S1",
            "sessionStartTime": "2022-10-18T20:30:00.000Z",
            "sessionTimeId": "1656654052314001G5Ps",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-improving-image-editing-pantone-skintone-valid-s719.html",
            "id": "bb4d611e-db8b-3940-adb7-3e7092d83273",
            "sortDate": "2022-10-18T20:30:00.000Z",
            "sessionTitle": "Improving Image Editing: Pantone SkinTone Validated Monitor",
            "sessionCode": "S719",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:00:00.000Z",
            "sessionId": "16515987173670016x6V",
            "sessionStartTime": "2022-10-18T20:30:00.000Z",
            "sessionTimeId": "165575864824500187qS",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/products/photoshop-express",
                    "title": "Photoshop Express"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/products/behance",
                    "title": "Behance"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/substance-3d-designer",
                    "title": "Substance 3D Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/products/lightroom-on-mobile",
                    "title": "Lightroom on mobile"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-meet-the-max-speaker-lisa-carney-al602.html",
            "id": "c20e10ad-7f8b-345f-bda8-07be94e99c73",
            "sortDate": "2022-10-18T20:30:00.000Z",
            "sessionTitle": "Meet the MAX Speaker: Lisa Carney",
            "sessionCode": "AL602",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:00:00.000Z",
            "sessionId": "1658970711026001XJ2D",
            "sessionStartTime": "2022-10-18T20:30:00.000Z",
            "sessionTimeId": "1658973192654001HNIH",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-build-and-improve-your-design-workflows-in-ind-s303.html",
            "id": "2c2fd7fa-d0b7-3f8a-ab97-bfdac633e91a",
            "sortDate": "2022-10-18T20:30:00.000Z",
            "sessionTitle": "Build and Improve Your Design Workflows in InDesign",
            "sessionCode": "S303",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:00:00.000Z",
            "sessionId": "1651011982713001qBiw",
            "sessionStartTime": "2022-10-18T20:30:00.000Z",
            "sessionTimeId": "1656628921676001I3TF",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/capture",
                    "title": "Capture"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-designing-creative-collaboration-in-a-remote-w-s501.html",
            "id": "e6e14b73-20f4-37d4-a014-f9c129d9fe04",
            "isFeatured": true,
            "sortDate": "2022-10-18T21:00:00.000Z",
            "sessionTitle": "Designing Creative Collaboration in a Remote Workplace",
            "sessionCode": "S501",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:30:00.000Z",
            "sessionId": "1651011983796001q4M5",
            "sessionStartTime": "2022-10-18T21:00:00.000Z",
            "sessionTimeId": "1656629030503001G6Eu",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-tech-and-creativity-best-skills-to-learn-for-a-s202.html",
            "id": "49e43b8e-19cb-3fad-8c95-63cb07680915",
            "sortDate": "2022-10-18T21:00:00.000Z",
            "sessionTitle": "Tech and Creativity: Best Skills to Learn for a Future Job",
            "sessionCode": "S202",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:30:00.000Z",
            "sessionId": "16491888616460015jcR",
            "sessionStartTime": "2022-10-18T21:00:00.000Z",
            "sessionTimeId": "1656629171537001ZBUq",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-use-presets-to-bring-your-photography-t-s402.html",
            "id": "d0bef8e8-27e7-3b29-8005-f3d0209f8a0d",
            "isFeatured": true,
            "sortDate": "2022-10-18T21:00:00.000Z",
            "sessionTitle": "How to Use Presets to Bring Your Photography to Life",
            "sessionCode": "S402",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:30:00.000Z",
            "sessionId": "1651011983224001qjjL",
            "sessionStartTime": "2022-10-18T21:00:00.000Z",
            "sessionTimeId": "1656628994515001KbI2",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-grow-your-design-aesthetic-into-a-multidiscipli-s310.html",
            "id": "36039fc9-f1df-382e-baa0-7f104e892da5",
            "isFeatured": true,
            "sortDate": "2022-10-18T21:00:00.000Z",
            "sessionTitle": "Grow Your Design Aesthetic into a Multidisciplinary Career",
            "sessionCode": "S310",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T21:30:00.000Z",
            "sessionId": "1651011983007001q6vJ",
            "sessionStartTime": "2022-10-18T21:00:00.000Z",
            "sessionTimeId": "1656629117359001GY0W",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-video-al603.html",
            "id": "8dbbfecd-1026-329f-bdd0-8363aa0f421b",
            "sortDate": "2022-10-18T21:15:00.000Z",
            "sessionTitle": "First Takes from the Community: Video",
            "sessionCode": "AL603",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-18T22:00:00.000Z",
            "sessionId": "1658970995715001HKsc",
            "sessionStartTime": "2022-10-18T21:15:00.000Z",
            "sessionTimeId": "1658973325068001Xcy2",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-3d-graphic-design-mixing-your-favorite-apps-wi-s100.html",
            "id": "ae98bd6b-c6c0-39b7-9842-a2d7983f119b",
            "isFeatured": true,
            "sortDate": "2022-10-18T21:30:00.000Z",
            "sessionTitle": "3D Graphic Design: Mixing Your Favorite Apps with 3D Tools",
            "sessionCode": "S100",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:00:00.000Z",
            "sessionId": "1651011982285001qJ59",
            "sessionStartTime": "2022-10-18T21:30:00.000Z",
            "sessionTimeId": "1656654092042001zrly",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/substance-3d-modeler",
                    "title": "Substance 3D Modeler"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-from-stills-to-video-how-to-transition-like-a-s718.html",
            "id": "7de702af-8b6f-3026-913e-cae40f69c1a4",
            "sortDate": "2022-10-18T21:30:00.000Z",
            "sessionTitle": "From Stills to Video: How to Transition Like a Pro",
            "sessionCode": "S718",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:00:00.000Z",
            "sessionId": "165159871719800161hh",
            "sessionStartTime": "2022-10-18T21:30:00.000Z",
            "sessionTimeId": "16557585864980018UcW",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-unlocking-the-value-of-design-advancing-your-d-s152.html",
            "id": "f5cb202b-0ad0-3e4a-bca9-aed08b49361c",
            "isFeatured": true,
            "sortDate": "2022-10-18T21:30:00.000Z",
            "sessionTitle": "Unlocking the Value of Design: Advancing Your Design Practice",
            "sessionCode": "S152",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:00:00.000Z",
            "sessionId": "1651011982518001q7eu",
            "sessionStartTime": "2022-10-18T21:30:00.000Z",
            "sessionTimeId": "1656629331944001hmbZ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-the-power-of-color-in-graphic-design-s311.html",
            "id": "4c885b84-9177-3a55-a247-fab0f001c67d",
            "sortDate": "2022-10-18T21:30:00.000Z",
            "sessionTitle": "The Power of Color in Graphic Design",
            "sessionCode": "S311",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:00:00.000Z",
            "sessionId": "1651011983050001q2uJ",
            "sessionStartTime": "2022-10-18T21:30:00.000Z",
            "sessionTimeId": "1656629302759001IYzM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-build-your-tiktok-following-s453.html",
            "id": "6c76880a-0c26-3bf0-9922-d5cfdc297e43",
            "isFeatured": true,
            "sortDate": "2022-10-18T22:00:00.000Z",
            "sessionTitle": "How to Build Your TikTok Following",
            "sessionCode": "S453",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:30:00.000Z",
            "sessionId": "1651011983575001qbOt",
            "sessionStartTime": "2022-10-18T22:00:00.000Z",
            "sessionTimeId": "16566293979720016EPe",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-create-professional-portraits-with-your-s407.html",
            "id": "7cfe60d1-8981-3d97-afd9-502afb84604c",
            "sortDate": "2022-10-18T22:00:00.000Z",
            "sessionTitle": "How to Create Professional Portraits with Your Smartphone",
            "sessionCode": "S407",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:30:00.000Z",
            "sessionId": "1651011983423001qUEt",
            "sessionStartTime": "2022-10-18T22:00:00.000Z",
            "sessionTimeId": "1656654144453001ZAVn",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-the-art-of-storytelling-behind-the-scenes-of-l-s607.html",
            "id": "9707f074-068e-3b4e-a4e9-d1a3f0535074",
            "isFeatured": true,
            "sortDate": "2022-10-18T22:00:00.000Z",
            "sessionTitle": "The Art of Storytelling: Behind the Scenes of “Luck”",
            "sessionCode": "S607",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:30:00.000Z",
            "sessionId": "1656544316237001Gjl0",
            "sessionStartTime": "2022-10-18T22:00:00.000Z",
            "sessionTimeId": "1659109895272001wS2U",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-effectively-manage-your-creative-ecosys-s723.html",
            "id": "a8e88cec-0cfd-3621-a9f3-4debc0b7a5ee",
            "sortDate": "2022-10-18T22:00:00.000Z",
            "sessionTitle": "How to Effectively Manage Your Creative Ecosystem",
            "sessionCode": "S723",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T22:30:00.000Z",
            "sessionId": "16515987179990016gMv",
            "sessionStartTime": "2022-10-18T22:00:00.000Z",
            "sessionTimeId": "1655758949073001SrVr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/photoshop-express",
                    "title": "Photoshop Express"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/products/behance",
                    "title": "Behance"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-substance-3d-pai-al604.html",
            "id": "213a7fcc-8a30-3d72-ba36-b7c2d36ff42d",
            "sortDate": "2022-10-18T22:15:00.000Z",
            "sessionTitle": "First Takes from the Community: Substance 3D Painter & Stager",
            "sessionCode": "AL604",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-18T23:00:00.000Z",
            "sessionId": "1658971186674001HJF8",
            "sessionStartTime": "2022-10-18T22:15:00.000Z",
            "sessionTimeId": "16589734800250018uQ1",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-harness-the-power-of-creative-expression-for-s-s6006.html",
            "id": "ad237f66-8fe7-3012-a053-080250d4be3b",
            "isFeatured": true,
            "sortDate": "2022-10-18T22:15:00.000Z",
            "sessionTitle": "Harness the Power of Creative Expression for Social Change",
            "sessionCode": "S6006",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-18T23:15:00.000Z",
            "sessionId": "1654724304824001iycY",
            "sessionStartTime": "2022-10-18T22:15:00.000Z",
            "sessionTimeId": "1657576235514001W98M",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-cultivating-creativity-through-education-polici-s209.html",
            "id": "670cce72-f8cc-3a62-a150-32c184576962",
            "sortDate": "2022-10-18T22:30:00.000Z",
            "sessionTitle": "Cultivating Creativity Through Education Policies",
            "sessionCode": "S209",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:00:00.000Z",
            "sessionId": "16493657824270011AFG",
            "sessionStartTime": "2022-10-18T22:30:00.000Z",
            "sessionTimeId": "1656629439949001Gtbi",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-cinemagraph-techniques-in-after-effects-s605.html",
            "id": "66d46369-138f-398d-986a-13f304485b92",
            "isFeatured": true,
            "sortDate": "2022-10-18T22:30:00.000Z",
            "sessionTitle": "Cinemagraph Techniques in After Effects",
            "sessionCode": "S605",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:00:00.000Z",
            "sessionId": "1651011984112001qkL1",
            "sessionStartTime": "2022-10-18T22:30:00.000Z",
            "sessionTimeId": "1656654176461001Z0HT",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-indigenous-storytelling-perspectives-of-sundan-s727.html",
            "id": "28f38826-b7f5-3bd6-bcf9-b9b862ef144b",
            "sortDate": "2022-10-18T22:30:00.000Z",
            "sessionTitle": "Indigenous Storytelling: Perspectives of Sundance Filmmakers",
            "sessionCode": "S727",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:00:00.000Z",
            "sessionId": "16515987186400016RZK",
            "sessionStartTime": "2022-10-18T22:30:00.000Z",
            "sessionTimeId": "1655758504383001iQFC",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-consuming-typography-the-experience-from-brain-s312.html",
            "id": "083016e9-e4d6-3cf0-add0-69afea0c57aa",
            "isFeatured": true,
            "sortDate": "2022-10-18T22:30:00.000Z",
            "sessionTitle": "Consuming Typography: The Experience from Brain to Senses",
            "sessionCode": "S312",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:00:00.000Z",
            "sessionId": "1651011983091001qEAr",
            "sessionStartTime": "2022-10-18T22:30:00.000Z",
            "sessionTimeId": "1661185711234001K43G",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-tell-an-authentic-brand-story-with-pinterest-a-s451.html",
            "id": "f580b214-899c-35c6-8488-d7871db17c2a",
            "isFeatured": true,
            "sortDate": "2022-10-18T23:00:00.000Z",
            "sessionTitle": "Tell an Authentic Brand Story with Pinterest & Adobe Express",
            "sessionCode": "S451",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:30:00.000Z",
            "sessionId": "1651011983499001qXJ2",
            "sessionStartTime": "2022-10-18T23:00:00.000Z",
            "sessionTimeId": "1656629546084001GUgw",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-lightroom-tips-for-creating-supersellable-stoc-s406.html",
            "id": "28dd248c-13d0-3f5e-add5-71d38af77c42",
            "sortDate": "2022-10-18T23:00:00.000Z",
            "sessionTitle": "Lightroom Tips for Creating Super-Sellable Stock Photos",
            "sessionCode": "S406",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:30:00.000Z",
            "sessionId": "1651011983387001qt5x",
            "sessionStartTime": "2022-10-18T23:00:00.000Z",
            "sessionTimeId": "1656654216081001zzs8",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-adobe-indesign-tips-for-efficient-layout-and-d-s302.html",
            "id": "073eb11e-5438-33bd-b12a-0e79f49b7380",
            "isFeatured": true,
            "sortDate": "2022-10-18T23:00:00.000Z",
            "sessionTitle": "Adobe InDesign Tips for Efficient Layout and Design",
            "sessionCode": "S302",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:30:00.000Z",
            "sessionId": "1651011982669001qdN6",
            "sessionStartTime": "2022-10-18T23:00:00.000Z",
            "sessionTimeId": "1656629575602001ZB3H",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-the-autobiography-of-an-independent-type-found-s301.html",
            "id": "beac3d24-7e0c-3aaf-80ef-c0ebbbd1876e",
            "sortDate": "2022-10-18T23:00:00.000Z",
            "sessionTitle": "The Autobiography of an Independent Type Foundry",
            "sessionCode": "S301",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:30:00.000Z",
            "sessionId": "1651011982631001q90d",
            "sessionStartTime": "2022-10-18T23:00:00.000Z",
            "sessionTimeId": "1656629603701001KutK",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-meet-the-max-speaker-spencer-nugent-al605.html",
            "id": "8c19fa20-7caa-3904-b401-d13e96b17181",
            "sortDate": "2022-10-18T23:15:00.000Z",
            "sessionTitle": "Meet the MAX Speaker: Spencer Nugent",
            "sessionCode": "AL605",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-18T23:45:00.000Z",
            "sessionId": "1658971348775001NmKQ",
            "sessionStartTime": "2022-10-18T23:15:00.000Z",
            "sessionTimeId": "1658973630735001H1K2",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-visual-medicine-through-an-indigenous-s6002.html",
            "id": "40f18165-0b69-3aad-8670-d05e87c35f23",
            "isFeatured": true,
            "sortDate": "2022-10-19T00:15:00.000Z",
            "sessionTitle": "Creating Visual Medicine Through an Indigenous Lens",
            "sessionCode": "S6002",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-19T01:15:00.000Z",
            "sessionId": "16491890234900019Tm0",
            "sessionStartTime": "2022-10-19T00:15:00.000Z",
            "sessionTimeId": "1657765459327001oaHu",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/japan-keynote-mb2.html",
            "id": "d37d8083-991e-31b2-a81e-1704730679b8",
            "sortDate": "2022-10-19T01:00:00.000Z",
            "sessionTitle": "Japan Keynote",
            "sessionCode": "MB2",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-19T02:30:00.000Z",
            "sessionId": "1655232069682001nbdX",
            "sessionStartTime": "2022-10-19T01:00:00.000Z",
            "sessionTimeId": "16575838936800019WSH",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-source-of-creativity-mb3.html",
            "id": "4e94f027-2b1e-3169-9472-ad81a091c6a7",
            "sortDate": "2022-10-19T03:00:00.000Z",
            "sessionTitle": "Source of Creativity",
            "sessionCode": "MB3",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-19T04:00:00.000Z",
            "sessionId": "1655232069643001nQQC",
            "sessionStartTime": "2022-10-19T03:00:00.000Z",
            "sessionTimeId": "1663617720929001rHRv",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-getting-started-with-adobe-xd-s959.html",
            "id": "7e503566-9c1d-3563-92a5-f8aa346fc185",
            "sortDate": "2022-10-19T04:30:00.000Z",
            "sessionTitle": "Getting Started with Adobe XD",
            "sessionCode": "S959",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T05:00:00.000Z",
            "sessionId": "1652997315727001jWil",
            "sessionStartTime": "2022-10-19T04:30:00.000Z",
            "sessionTimeId": "1661205061229001X4nB",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-learn-new-premiere-pro-techniques-s966.html",
            "id": "63f27391-92dd-31c6-98b3-95a438d05b9e",
            "sortDate": "2022-10-19T04:30:00.000Z",
            "sessionTitle": "Learn New Premiere Pro Techniques",
            "sessionCode": "S966",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T05:00:00.000Z",
            "sessionId": "1652997315995001jQOD",
            "sessionStartTime": "2022-10-19T04:30:00.000Z",
            "sessionTimeId": "16612055732300019ORO",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-supereasy-photoshop-editing-techniques-that-you-s950.html",
            "id": "fea37b6d-46e7-3df2-a5ac-b036fe85a2da",
            "sortDate": "2022-10-19T04:30:00.000Z",
            "sessionTitle": "Easy Photo Editing Techniques That You Can Teach Yourself",
            "sessionCode": "S950",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T05:00:00.000Z",
            "sessionId": "1652997315364001jrgA",
            "sessionStartTime": "2022-10-19T04:30:00.000Z",
            "sessionTimeId": "1661204762765001K8mt",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-using-substance-painter-for-metaverse-content-s963.html",
            "id": "d0aa4233-493b-3b06-90a4-568dfc55fe59",
            "sortDate": "2022-10-19T05:00:00.000Z",
            "sessionTitle": "Using Substance 3D Painter for Metaverse Content",
            "sessionCode": "S963",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T05:30:00.000Z",
            "sessionId": "1652997315880001jMga",
            "sessionStartTime": "2022-10-19T05:00:00.000Z",
            "sessionTimeId": "1661205896458001SLth",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-create-magical-videos-in-premiere-pro-s967.html",
            "id": "6667dab6-f0fe-3379-8d97-6548c6387c9b",
            "sortDate": "2022-10-19T05:00:00.000Z",
            "sessionTitle": "Create Magical Videos in Premiere Pro",
            "sessionCode": "S967",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T05:30:00.000Z",
            "sessionId": "1652997316032001jVmN",
            "sessionStartTime": "2022-10-19T05:00:00.000Z",
            "sessionTimeId": "1661205943850001X5tI",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-tips-for-creating-better-designs-illustrator-be-s951.html",
            "id": "1e68be93-9560-3908-a6b9-014385bf85c2",
            "sortDate": "2022-10-19T05:00:00.000Z",
            "sessionTitle": "Tips to Create Better Designs: Illustrator Beginner’s School",
            "sessionCode": "S951",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T05:30:00.000Z",
            "sessionId": "1652997315404001j7Rg",
            "sessionStartTime": "2022-10-19T05:00:00.000Z",
            "sessionTimeId": "1661205725300001E0cQ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-how-to-make-videos-that-go-viral-s975.html",
            "id": "d4c5dc5b-7a68-303c-9dcf-2293118cb47d",
            "sortDate": "2022-10-19T05:30:00.000Z",
            "sessionTitle": "How to Make Videos That Go Viral",
            "sessionCode": "S975",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:00:00.000Z",
            "sessionId": "1652997316351001jsj3",
            "sessionStartTime": "2022-10-19T05:30:00.000Z",
            "sessionTimeId": "1661991983390001Lo7J",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-getting-started-easily-with-web-design-using-ad-s960.html",
            "id": "6be160f1-92ec-3e4a-b02a-c6cbb19b09e5",
            "sortDate": "2022-10-19T05:30:00.000Z",
            "sessionTitle": "Getting Started Easily with Web Design Using Adobe XD",
            "sessionCode": "S960",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:00:00.000Z",
            "sessionId": "1652997315764001jUV5",
            "sessionStartTime": "2022-10-19T05:30:00.000Z",
            "sessionTimeId": "1661207550069001CLIx",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-lets-update-how-to-create-video-content-with-fr-s968.html",
            "id": "ec206cb4-51b8-3e7a-a079-a1f71d663198",
            "sortDate": "2022-10-19T05:30:00.000Z",
            "sessionTitle": "Let’s Update: How to Create Video Content with Frame.io",
            "sessionCode": "S968",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:00:00.000Z",
            "sessionId": "1652997316070001j3nE",
            "sessionStartTime": "2022-10-19T05:30:00.000Z",
            "sessionTimeId": "1661207824038001FN18",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-easy-type-design-with-illustrator-for-beginners-s952.html",
            "id": "74187e94-9e36-327b-884e-107e6ce6c34f",
            "sortDate": "2022-10-19T05:30:00.000Z",
            "sessionTitle": "Easy Type Design with Illustrator for Beginners: How to Make Your Own Fonts",
            "sessionCode": "S952",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:00:00.000Z",
            "sessionId": "1652997315442001jsP1",
            "sessionStartTime": "2022-10-19T05:30:00.000Z",
            "sessionTimeId": "1661206133662001SVjr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-using-the-lightroom-mobile-app-to-animate-every-s976.html",
            "id": "68043904-3721-3336-be42-059b09b1fe1c",
            "sortDate": "2022-10-19T06:00:00.000Z",
            "sessionTitle": "Using the Lightroom Mobile App to Animate Everyday Life",
            "sessionCode": "S976",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:30:00.000Z",
            "sessionId": "1652997316395001j1FI",
            "sessionStartTime": "2022-10-19T06:00:00.000Z",
            "sessionTimeId": "1661208556069001XVLN",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-ar-development-use-of-adobe-aero-by-ui-designer-s962.html",
            "id": "9b915f1e-4d9a-3006-9b74-4429581bb297",
            "sortDate": "2022-10-19T06:00:00.000Z",
            "sessionTitle": "AR Development: Use of Adobe Aero by UI Designers",
            "sessionCode": "S962",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:30:00.000Z",
            "sessionId": "1652997315842001jQ5j",
            "sessionStartTime": "2022-10-19T06:00:00.000Z",
            "sessionTimeId": "1661208196395001FTVO",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-use-after-effects-to-create-moving-illustration-s969.html",
            "id": "03d61b62-7003-385a-ae99-827482029bba",
            "sortDate": "2022-10-19T06:00:00.000Z",
            "sessionTitle": "Use After Effects to Create Moving Illustrations",
            "sessionCode": "S969",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:30:00.000Z",
            "sessionId": "1652997316107001jTgI",
            "sessionStartTime": "2022-10-19T06:00:00.000Z",
            "sessionTimeId": "1661208326241001SDdq",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-new-features-in-illustrator-and-photoshop-that-s953.html",
            "id": "d7548168-762f-3932-a845-e6a6012c4e71",
            "sortDate": "2022-10-19T06:00:00.000Z",
            "sessionTitle": "New Features in Editing Tools: Illustrator and Photoshop",
            "sessionCode": "S953",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T06:30:00.000Z",
            "sessionId": "1652997315479001jXvt",
            "sessionStartTime": "2022-10-19T06:00:00.000Z",
            "sessionTimeId": "1661207917642001E4pv",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-intuitive-design-in-adobe-express-for-anyone-s973.html",
            "id": "b62a7011-ac7f-3d94-9a7b-be89fe0fadc1",
            "sortDate": "2022-10-19T06:30:00.000Z",
            "sessionTitle": "Intuitive Design in Adobe Express for Anyone",
            "sessionCode": "S973",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:00:00.000Z",
            "sessionId": "1652997316274001jqBD",
            "sessionStartTime": "2022-10-19T06:30:00.000Z",
            "sessionTimeId": "1661210712010001KGVV",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-using-adobe-xd-to-collaborate-in-the-new-normal-s957.html",
            "id": "a9e44ef9-99d2-36bc-a130-211d690b3a01",
            "sortDate": "2022-10-19T06:30:00.000Z",
            "sessionTitle": "Using Adobe XD to Collaborate in the New Normal Era",
            "sessionCode": "S957",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:00:00.000Z",
            "sessionId": "1652997315652001jHoR",
            "sessionStartTime": "2022-10-19T06:30:00.000Z",
            "sessionTimeId": "1661216207703001SPN9",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-deep-dive-how-to-create-motion-graphics-with-af-s970.html",
            "id": "ea785ee3-c7a8-3cc5-a286-4426ee2c2325",
            "sortDate": "2022-10-19T06:30:00.000Z",
            "sessionTitle": "Deep Dive: How to Create Motion Graphics with After Effects",
            "sessionCode": "S970",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:00:00.000Z",
            "sessionId": "1652997316146001juR7",
            "sessionStartTime": "2022-10-19T06:30:00.000Z",
            "sessionTimeId": "16612105966010019VwK",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-new-updates-latest-information-and-ways-to-util-s954.html",
            "id": "7e3961c0-3814-3f95-b62f-ce0325a2aa7b",
            "sortDate": "2022-10-19T06:30:00.000Z",
            "sessionTitle": "New Updates! Latest Information and Ways to Utilize Adobe Fonts",
            "sessionCode": "S954",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:00:00.000Z",
            "sessionId": "1652997315524001jlFs",
            "sessionStartTime": "2022-10-19T06:30:00.000Z",
            "sessionTimeId": "1661208723824001F8XZ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-using-basic-functions-to-draw-ultrarealistic-il-s956.html",
            "id": "c3372d47-dd26-32d4-b4da-73c867467a3b",
            "sortDate": "2022-10-19T07:00:00.000Z",
            "sessionTitle": "Use Fresco Basic Functions to Evolve Illustrations Dramatically!",
            "sessionCode": "S956",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:30:00.000Z",
            "sessionId": "1652997315615001jhWX",
            "sessionStartTime": "2022-10-19T07:00:00.000Z",
            "sessionTimeId": "1661210885012001XLQt",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-using-xd-and-after-effects-to-create-designs-wi-s958.html",
            "id": "1619a807-d08d-38e2-b7f7-42ab00bda168",
            "sortDate": "2022-10-19T07:00:00.000Z",
            "sessionTitle": "Using XD and After Effects to Create Designs with Texture",
            "sessionCode": "S958",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:30:00.000Z",
            "sessionId": "1652997315688001jzYV",
            "sessionStartTime": "2022-10-19T07:00:00.000Z",
            "sessionTimeId": "1661210999254001Km1i",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-premiere-pro-color-adjustment-techniques-s971.html",
            "id": "8c66bfb4-d775-3291-8d8d-08cd3bf5fa8b",
            "sortDate": "2022-10-19T07:00:00.000Z",
            "sessionTitle": "Premiere Pro Color Adjustment Techniques",
            "sessionCode": "S971",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:30:00.000Z",
            "sessionId": "1652997316193001jovs",
            "sessionStartTime": "2022-10-19T07:00:00.000Z",
            "sessionTimeId": "1661211131818001CBkA",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-amazing-clipping-and-cropping-techniques-in-pho-s964.html",
            "id": "1366128f-bfe4-380d-b1ef-15b85406aa95",
            "sortDate": "2022-10-19T07:00:00.000Z",
            "sessionTitle": "Amazing Clipping and Cropping Techniques in Photoshop",
            "sessionCode": "S964",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T07:30:00.000Z",
            "sessionId": "1652997315916001jniy",
            "sessionStartTime": "2022-10-19T07:00:00.000Z",
            "sessionTimeId": "1661215567540001Kygr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-adobe-express-use-cases-in-primary-middle-and-h-s974.html",
            "id": "99065b40-9b78-3aa7-9fb6-f66d9b94306c",
            "sortDate": "2022-10-19T07:30:00.000Z",
            "sessionTitle": "Adobe Express Use Cases in Primary, Middle, and High Schools",
            "sessionCode": "S974",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:00:00.000Z",
            "sessionId": "1652997316313001joU4",
            "sessionStartTime": "2022-10-19T07:30:00.000Z",
            "sessionTimeId": "1661213347272001Xaqf",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-premiere-pro-and-audition-audio-cheats-to-set-y-s972.html",
            "id": "f7218860-b68e-398f-a64c-f803f8c39f5c",
            "sortDate": "2022-10-19T07:30:00.000Z",
            "sessionTitle": "Premiere Pro and Audition: Audio Cheats to Set You Apart",
            "sessionCode": "S972",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:00:00.000Z",
            "sessionId": "1652997316233001juXx",
            "sessionStartTime": "2022-10-19T07:30:00.000Z",
            "sessionTimeId": "16612131615670019uBG",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-game-ui-design-workflow-making-full-use-of-crea-s979.html",
            "id": "8ea580a7-dfb2-34be-8a47-7439f5d7128f",
            "sortDate": "2022-10-19T07:30:00.000Z",
            "sessionTitle": "Game UI Design Workflow: Making Full Use of Creative Cloud",
            "sessionCode": "S979",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:00:00.000Z",
            "sessionId": "1652997316503001jzWx",
            "sessionStartTime": "2022-10-19T07:30:00.000Z",
            "sessionTimeId": "1661213477835001FUR9",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-get-the-latest-technology-compatibility-in-prin-s955.html",
            "id": "c61685f7-f70a-3b97-8b11-014d4e542ee1",
            "sortDate": "2022-10-19T07:30:00.000Z",
            "sessionTitle": "Get the Latest Technology & Compatibility in Printing & Design Industry",
            "sessionCode": "S955",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:00:00.000Z",
            "sessionId": "1652997315567001jgvd",
            "sessionStartTime": "2022-10-19T07:30:00.000Z",
            "sessionTimeId": "1661211747370001F7r6",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-adobe-xd-timesaving-techniques-that-make-produc-s961.html",
            "id": "e94c719a-ee84-3719-9f89-f01b564a8f90",
            "sortDate": "2022-10-19T08:00:00.000Z",
            "sessionTitle": "Adobe XD Timesaving Techniques That Make Production Easier",
            "sessionCode": "S961",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:30:00.000Z",
            "sessionId": "1652997315802001jW7g",
            "sessionStartTime": "2022-10-19T08:00:00.000Z",
            "sessionTimeId": "1661213694144001SUSF",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-musashino-art-university-students-on-designing-s977.html",
            "id": "dc72cb7f-5cd7-3ed4-b353-7d55bee1671e",
            "sortDate": "2022-10-19T08:00:00.000Z",
            "sessionTitle": "Musashino Art University Students on Designing with Empathy",
            "sessionCode": "S977",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:30:00.000Z",
            "sessionId": "1652997316432001jU8L",
            "sessionStartTime": "2022-10-19T08:00:00.000Z",
            "sessionTimeId": "16612139321240019T3V",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-how-to-hone-your-creativity-with-adobe-stock-s965.html",
            "id": "34c5c56d-b62c-3a50-bd06-a3131df89701",
            "sortDate": "2022-10-19T08:00:00.000Z",
            "sessionTitle": "How to Hone Your Creativity with Adobe Stock",
            "sessionCode": "S965",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:30:00.000Z",
            "sessionId": "1652997315955001jYgK",
            "sessionStartTime": "2022-10-19T08:00:00.000Z",
            "sessionTimeId": "16612138233470019DEr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/jp-hr-development-design-for-nextgeneration-proble-s978.html",
            "id": "d186ab64-0d5a-3240-8c7d-ba6660be6ecd",
            "sortDate": "2022-10-19T08:00:00.000Z",
            "sessionTitle": "HR Development Design for Next-Generation Problem-Solving ",
            "sessionCode": "S978",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T08:30:00.000Z",
            "sessionId": "1652997316467001jc5A",
            "sessionStartTime": "2022-10-19T08:00:00.000Z",
            "sessionTimeId": "1661215980241001SkQ4",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-unleashing-creativity-with-emeas-leading-expe-mb4.html",
            "id": "84e45e64-544a-3181-ac6d-5de4768d8021",
            "isFeatured": true,
            "sortDate": "2022-10-19T12:00:00.000Z",
            "sessionTitle": "Unleashing Creativity with EMEA’s Leading Experts",
            "sessionCode": "MB4",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-19T13:00:00.000Z",
            "sessionId": "1655232069719001nfJN",
            "sessionStartTime": "2022-10-19T12:00:00.000Z",
            "sessionTimeId": "1661869127964001Zjdr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-origins-of-a-remixed-art-style-with-studio-bl-s802.html",
            "id": "69608850-2041-396a-bd47-20d28e1c20ac",
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Origins of a Remixed Art Style with Studio BLUP",
            "sessionCode": "S802",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314523001jewi",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "16603125979570011dmm",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-building-consistent-branding-with-adobe-expre-s810.html",
            "id": "867fef7e-b796-36f9-81ec-948f3d54469e",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Building Consistent Branding with Adobe Express",
            "sessionCode": "S810",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314820001jxzQ",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1660312338087001pe6w",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-physical-virtual-and-digital-creation-serial-s805.html",
            "id": "7a8cf7be-2dcb-37f3-9d5e-69da30d47f58",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Physical, Virtual, and Digital Creation: Serial Cut",
            "sessionCode": "S805",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314634001jyYs",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1661263451101001EsuL",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-adobe-digital-edge-awards-meet-the-winners-s813.html",
            "id": "4bc7f770-53a0-3890-84df-4431f29a9f1c",
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Adobe Digital Edge Awards: Meet the Winners",
            "sessionCode": "S813",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314933001jEjp",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "166005923550300186NA",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/category/distance-learning",
                    "title": "Distance Learning"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-making-it-in-motion-design-a-guide-to-getting-s606.html",
            "id": "0699cc7a-12cf-3dcc-9f5c-cfc28781084f",
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Making it in Motion Design: A Guide to Getting Hired",
            "sessionCode": "S606",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1651011984147001qKhs",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1658865406798001Wf21",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-first-takes-from-the-community-photo-al612.html",
            "id": "ca5c2c7b-541c-35d6-a54c-edda9c928ac9",
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "First Takes from the Community: Photo",
            "sessionCode": "AL612",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1660106499554001fTEY",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1660106904125001eLPX",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-art-of-photo-storytelling-translate-messages-s806.html",
            "id": "8cd83f0a-2e04-3903-ab3f-1e05ed3c652c",
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Art of Photo Storytelling: Translate Messages into Images",
            "sessionCode": "S806",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314671001jA37",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1659482452426001I8Yk",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-the-future-of-digital-photography-and-virtual-s812.html",
            "id": "3df3f714-a38c-392e-9ccc-917fbee4f23c",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "The Future of Digital Photography and Virtual Sets",
            "sessionCode": "S812",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314895001jAYj",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1661786311346001zfc7",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-creating-infographics-and-engaging-data-visu-s800.html",
            "id": "07b37bac-02fb-3d29-ada4-59a799a8a42a",
            "sortDate": "2022-10-19T13:00:00.000Z",
            "sessionTitle": "Creating Infographics and Engaging Data Visualizations",
            "sessionCode": "S800",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T13:30:00.000Z",
            "sessionId": "1652997314451001j3sH",
            "sessionStartTime": "2022-10-19T13:00:00.000Z",
            "sessionTimeId": "1658862715274001WzYY",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-design-synthesize-with-simple-colors-geometri-s801.html",
            "id": "8e7c1813-416b-39cc-8d09-0ce32a72211a",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "Design & Synthesize with Simple Colors & Geometric Shapes",
            "sessionCode": "S801",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1652997314488001jKVg",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "16600637745680018RQp",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-how-to-build-your-tiktok-following-s453.html",
            "id": "aea71669-2faa-31c0-a809-8a5cdffe50a0",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "How to Build Your TikTok Following",
            "sessionCode": "S453",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1651011983575001qbOt",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "16588656211740018rgL",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-creativity-as-fuel-for-student-centered-learn-s204.html",
            "id": "3289a69a-70c6-363f-b2c6-f1cfddf0055b",
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "Creativity as Fuel for Student Centered Learning and Wellbeing",
            "sessionCode": "S204",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "16491888617090015Isk",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "1658865527323001ziqm",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-sound-and-emotional-visualization-via-audiovi-s803.html",
            "id": "84031a92-e128-3254-9026-eecef97265ba",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "Sound and Emotional Visualization via Audiovisual Programming",
            "sessionCode": "S803",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1652997314559001jxFr",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "1660058904713001KQdx",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-first-takes-from-the-community-ai-al613.html",
            "id": "e97c2c36-0e52-3689-8882-d38c84cd63e1",
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "First Takes from the Community: Adobe Illustrator",
            "sessionCode": "AL613",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1660106935403001dkX0",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "1660107154628001oH3U",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-lightroom-tips-for-creating-supersellable-sto-s406.html",
            "id": "b203b509-1f33-3779-a512-5c7100060b94",
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "Lightroom Tips for Creating Super-Sellable Stock Photos",
            "sessionCode": "S406",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1651011983387001qt5x",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "16588655917300018SKS",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-creating-smarter-with-customizable-templates-s151.html",
            "id": "78ede362-e4ab-357e-ba04-0894703d330b",
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "Creating Smarter with Customizable Templates in the Cloud",
            "sessionCode": "S151",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1651011982479001qZI8",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "1658865465019001bb8C",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-discover-the-golden-secrets-of-lettering-s300.html",
            "id": "4bb57647-a29e-3f2d-99ea-cc2764d94b67",
            "isFeatured": true,
            "sortDate": "2022-10-19T13:30:00.000Z",
            "sessionTitle": "Discover the Golden Secrets of Lettering",
            "sessionCode": "S300",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:00:00.000Z",
            "sessionId": "1651011982588001q1vt",
            "sessionStartTime": "2022-10-19T13:30:00.000Z",
            "sessionTimeId": "1658872190510001Ascp",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-how-to-create-experimental-lettering-with-fre-s217.html",
            "id": "08d8ce1b-525e-354d-99ae-fe2a966a8bb9",
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "How to Create Experimental Lettering with Fresco",
            "sessionCode": "S217",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1652999635289001jn0E",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1658865726365001gFHL",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-creating-characters-with-vr-modeling-in-subst-s103.html",
            "id": "fd89cab6-3ef1-3d74-921e-87a6877da78f",
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "Creating Characters with VR Modeling in Substance 3D Modeler",
            "sessionCode": "S103",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1651011982394001qwfn",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1658865673954001b26c",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/substance-3d-modeler",
                    "title": "Substance 3D Modeler"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-fast-cuts-and-creativity-quick-video-editing-s604.html",
            "id": "aa73638f-3b39-34c8-9058-cf7ff5bcf99d",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "Fast Cuts and Creativity: Quick Video Editing Techniques",
            "sessionCode": "S604",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "164918886361700154DP",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1658866153609001iciL",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-first-takes-from-the-community-fresco-al614.html",
            "id": "a0f4f2d0-36f1-35df-ba61-977f6a7ef720",
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "First Takes from the Community: Fresco",
            "sessionCode": "AL614",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1660107266880001enYf",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1660107445593001zkI5",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-explore-unrealistic-color-ideas-to-create-re-s807.html",
            "id": "df781e0d-4c2e-3dd5-840f-572abf360fb3",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "Explore Unrealistic Color Ideas to Create Realistic Memories",
            "sessionCode": "S807",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1652997314708001jRHY",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1658967829080001Hwpy",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-how-sap-improved-its-multimedia-production-in-s811.html",
            "id": "e826f9a0-f157-34bf-9ed9-31ce6c3767cd",
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "How SAP Improved Its Multimedia Production Infrastructure ",
            "sessionCode": "S811",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1652997314858001jJY2",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1661175915597001yo17",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-attentiongrabbing-graphics-social-media-anima-s306.html",
            "id": "b0f72c9f-7d53-36c5-8d2f-75c3cb091b4c",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "Attention-Grabbing Graphics: Social Media Animation",
            "sessionCode": "S306",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1651011982838001qHvR",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1658865801032001gImQ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-drawing-inspiration-in-graphic-design-s809.html",
            "id": "9efc3ccd-5736-3213-be61-73c2608d25b9",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:00:00.000Z",
            "sessionTitle": "Drawing Inspiration in Graphic Design",
            "sessionCode": "S809",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T14:30:00.000Z",
            "sessionId": "1652997314782001jGHO",
            "sessionStartTime": "2022-10-19T14:00:00.000Z",
            "sessionTimeId": "1660312429766001m9db",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-creating-illustrations-with-adobe-fresco-and-s218.html",
            "id": "40ddf7fc-7e11-3a34-b153-3d1986e9c653",
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "Creating Illustrations with Adobe Fresco and Capture",
            "sessionCode": "S218",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1652999635323001jDIj",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "16588679060030012JU0",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/capture",
                    "title": "Capture"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-using-metrics-to-build-a-successful-social-me-s450.html",
            "id": "7235256a-40b6-32d3-9727-92d1f8a74c42",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "Using Metrics to Build a Successful Social Media Strategy",
            "sessionCode": "S450",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1651011983460001q2P1",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "1658868176105001zAYe",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-more-than-a-slideshow-using-digital-artifacts-s205.html",
            "id": "3f2860f1-439e-3533-8659-7e3ad0a785b5",
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "More Than a Slideshow: Using Digital Artifacts in Your Class",
            "sessionCode": "S205",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "164918886174500158g7",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "1658867964751001gksK",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-designing-technology-of-the-future-for-realli-s804.html",
            "id": "bf839efc-3ace-3e8a-a399-320de923f391",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "Designing Technology of the Future for Real-life Products",
            "sessionCode": "S804",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1652997314596001jNS7",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "1659363640435001xFMu",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-first-takes-from-the-community-video-al615.html",
            "id": "4a5c4d9e-5da0-3562-854a-b2475b730cc1",
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "First Takes from the Community: Video",
            "sessionCode": "AL615",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1660107469412001dAvU",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "1660107654557001zyf7",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-creating-mouthwatering-food-photos-with-light-s403.html",
            "id": "d00ef8b8-a652-369d-8179-09eca5b72528",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "Creating Mouthwatering Food Photos with Lightroom",
            "sessionCode": "S403",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1651011983265001qKrz",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "16588680746250012hZl",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-unlocking-the-value-of-design-advancing-your-s152.html",
            "id": "64b3948e-e484-3242-99fd-cd6339a1a1f7",
            "isFeatured": true,
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "Unlocking the Value of Design: Advancing Your Design Practice",
            "sessionCode": "S152",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1651011982518001q7eu",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "1658866285296001WPu1",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-editorial-design-with-johannes-conrad-at-stud-s808.html",
            "id": "a04f5583-b96b-30f9-ac2e-d8912fc0c8e1",
            "sortDate": "2022-10-19T14:30:00.000Z",
            "sessionTitle": "Editorial Design with Johannes Conrad at Studio Yukiko",
            "sessionCode": "S808",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:00:00.000Z",
            "sessionId": "1652997314746001jmnd",
            "sessionStartTime": "2022-10-19T14:30:00.000Z",
            "sessionTimeId": "1660751970031001mO83",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-the-newest-drawing-features-in-adobe-fresco-s215.html",
            "id": "7f0c4bfc-0c0c-3ffc-873c-7962b960b0a6",
            "isFeatured": true,
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "The Newest Drawing Features in Adobe Fresco",
            "sessionCode": "S215",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1652999635214001j7x2",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "16588683933800012h24",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-increasing-productivity-and-collaboration-wit-s452.html",
            "id": "a0a0b84b-cb2f-3215-b74b-96bdd58f5ee2",
            "isFeatured": true,
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "Increasing Productivity and Collaboration with Adobe Express",
            "sessionCode": "S452",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1651011983542001qwuf",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "1658868791372001gR1K",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-3d-graphic-design-mixing-your-favorite-apps-w-s100.html",
            "id": "19848756-1198-3d06-b17e-dc415986db96",
            "isFeatured": true,
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "3D Graphic Design: Mixing Your Favorite Apps with 3D Tools",
            "sessionCode": "S100",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1651011982285001qJ59",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "1658868323020001WMbg",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/substance-3d-modeler",
                    "title": "Substance 3D Modeler"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-making-your-social-media-videos-pop-with-colo-s601.html",
            "id": "20dbcc4c-86af-3b10-b27b-0e9cb6b84bd1",
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "Making Your Social Media Videos Pop with Color",
            "sessionCode": "S601",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1651011983966001qM2h",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "1658868897658001f0Im",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-first-takes-from-the-community-adobe-express-al616.html",
            "id": "4ba9ba06-bd92-3b8b-b7af-ee573c8e0828",
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "First Takes from the Community: Adobe Express",
            "sessionCode": "AL616",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1660107672937001ela1",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "1660107931037001KaqM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-editing-techniques-and-tools-to-improve-your-s400.html",
            "id": "4f6ab81e-e73d-3aa1-9efb-2127a7960bdf",
            "isFeatured": true,
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "Editing Techniques and Tools to Improve Your Photos",
            "sessionCode": "S400",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1651011983134001qoRv",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "1658868708997001WGSa",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/emea-the-power-of-color-in-graphic-design-s311.html",
            "id": "3d212d0c-0113-30c2-9845-066d4ad1bc53",
            "sortDate": "2022-10-19T15:00:00.000Z",
            "sessionTitle": "The Power of Color in Graphic Design",
            "sessionCode": "S311",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T15:30:00.000Z",
            "sessionId": "1651011983050001q2uJ",
            "sessionStartTime": "2022-10-19T15:00:00.000Z",
            "sessionTimeId": "1658868493749001fTbA",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-alternative-ways-to-make-a-living-s6000.html",
            "id": "699e4bd4-9526-3336-88d3-40f6660bb96a",
            "isFeatured": true,
            "sortDate": "2022-10-19T15:30:00.000Z",
            "sessionTitle": "Alternative Ways to Make a Living",
            "sessionCode": "S6000",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-19T16:30:00.000Z",
            "sessionId": "16491890234210019yRP",
            "sessionStartTime": "2022-10-19T15:30:00.000Z",
            "sessionTimeId": "16570645013950012suv",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/inspiration-keynote-mb5.html",
            "id": "704f8020-d00c-3b4f-bc5c-7605ab1dccd5",
            "isFeatured": true,
            "sortDate": "2022-10-19T17:00:00.000Z",
            "sessionTitle": "Inspiration Keynote",
            "sessionCode": "MB5",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-19T18:30:00.000Z",
            "sessionId": "1655232069758001nGCU",
            "sessionStartTime": "2022-10-19T17:00:00.000Z",
            "sessionTimeId": "1656618255320001hLLQ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/inspiration-keynote-asl-mb5-1.html",
            "id": "02f04391-565c-398f-8d24-7cdff6f9207a",
            "sortDate": "2022-10-19T17:00:00.000Z",
            "sessionTitle": "Inspiration Keynote - ASL",
            "sessionCode": "MB5-1",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-19T18:30:00.000Z",
            "sessionId": "1663262687204001ag5y",
            "sessionStartTime": "2022-10-19T17:00:00.000Z",
            "sessionTimeId": "1663607605930001xFZc",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-design-a-successful-social-media-ad-cam-s454.html",
            "id": "55286f7a-1a80-3282-8ce5-e53a43ba0aef",
            "isFeatured": true,
            "sortDate": "2022-10-19T19:00:00.000Z",
            "sessionTitle": "How to Design a Successful Social Media Ad Campaign",
            "sessionCode": "S454",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T19:30:00.000Z",
            "sessionId": "1651011983611001qYdH",
            "sessionStartTime": "2022-10-19T19:00:00.000Z",
            "sessionTimeId": "1658956985891001pzgp",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-remotely-curious-learn-to-create-your-own-podc-s725.html",
            "id": "044e0b10-0e1e-31c3-85da-ba91843c126a",
            "sortDate": "2022-10-19T19:00:00.000Z",
            "sessionTitle": "Remotely Curious: Learn to Create Your Own Podcast",
            "sessionCode": "S725",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T19:30:00.000Z",
            "sessionId": "16515987183260016Xx7",
            "sessionStartTime": "2022-10-19T19:00:00.000Z",
            "sessionTimeId": "1655759081598001oWi1",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/products/behance",
                    "title": "Behance"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-more-than-a-slideshow-using-digital-artifacts-s205.html",
            "id": "74ae9ecc-8918-3f78-9d86-70239729ff4e",
            "sortDate": "2022-10-19T19:00:00.000Z",
            "sessionTitle": "More Than a Slideshow: Using Digital Artifacts in Your Class",
            "sessionCode": "S205",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T19:30:00.000Z",
            "sessionId": "164918886174500158g7",
            "sessionStartTime": "2022-10-19T19:00:00.000Z",
            "sessionTimeId": "1657742322258001eRzM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-substance-3d-mod-al606.html",
            "id": "fbfea4ba-6755-3e3d-bfbb-f88ca63e415e",
            "sortDate": "2022-10-19T19:00:00.000Z",
            "sessionTitle": "First Takes from the Community: Substance 3D Modeler",
            "sessionCode": "AL606",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-19T19:45:00.000Z",
            "sessionId": "16589715416060018X9Q",
            "sessionStartTime": "2022-10-19T19:00:00.000Z",
            "sessionTimeId": "16589744100290012knx",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-editing-techniques-and-tools-to-improve-your-p-s400.html",
            "id": "f91f1b5f-fe8f-31f2-b573-25c241ab0dbb",
            "isFeatured": true,
            "sortDate": "2022-10-19T19:00:00.000Z",
            "sessionTitle": "Editing Techniques and Tools to Improve Your Photos",
            "sessionCode": "S400",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T19:30:00.000Z",
            "sessionId": "1651011983134001qoRv",
            "sessionStartTime": "2022-10-19T19:00:00.000Z",
            "sessionTimeId": "1657745003040001En2a",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-making-it-in-motion-design-a-guide-to-getting-s606.html",
            "id": "e68ea0d2-e789-354d-925f-24e23811bd0d",
            "sortDate": "2022-10-19T19:30:00.000Z",
            "sessionTitle": "Making it in Motion Design: A Guide to Getting Hired",
            "sessionCode": "S606",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:00:00.000Z",
            "sessionId": "1651011984147001qKhs",
            "sessionStartTime": "2022-10-19T19:30:00.000Z",
            "sessionTimeId": "1657745172844001dHxU",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-digital-storytelling-epic-solo-himalayan-motor-s717.html",
            "id": "49f77549-4783-3cb0-8707-ec50235e686c",
            "isFeatured": true,
            "sortDate": "2022-10-19T19:30:00.000Z",
            "sessionTitle": "Digital Storytelling: Epic Solo Himalayan Motorcycle Trip",
            "sessionCode": "S717",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:00:00.000Z",
            "sessionId": "16515987170350016KcE",
            "sessionStartTime": "2022-10-19T19:30:00.000Z",
            "sessionTimeId": "1655758386678001qlu3",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/products/lightroom-on-mobile",
                    "title": "Lightroom on mobile"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-smarter-with-customizable-templates-i-s151.html",
            "id": "469b55ad-8a01-362d-9f41-a06412aa903e",
            "sortDate": "2022-10-19T19:30:00.000Z",
            "sessionTitle": "Creating Smarter with Customizable Templates in the Cloud",
            "sessionCode": "S151",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:00:00.000Z",
            "sessionId": "1651011982479001qZI8",
            "sessionStartTime": "2022-10-19T19:30:00.000Z",
            "sessionTimeId": "1657739293820001eOqt",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-design-powerhouse-trio-creative-software-in-co-s307.html",
            "id": "0a0cf741-5d9e-3716-8ae8-d811dc9174b0",
            "isFeatured": true,
            "sortDate": "2022-10-19T19:30:00.000Z",
            "sessionTitle": "Creative Software Powerhouse: Photoshop + Illustrator + InDesign",
            "sessionCode": "S307",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:00:00.000Z",
            "sessionId": "1651011982880001quVp",
            "sessionStartTime": "2022-10-19T19:30:00.000Z",
            "sessionTimeId": "1658535604940001Af1P",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-build-a-crosschannel-strategy-and-digit-s457.html",
            "id": "0ad50ff1-090e-3bb4-a118-402b3d6c7d3a",
            "sortDate": "2022-10-19T20:00:00.000Z",
            "sessionTitle": "How to Build a Cross-Channel Strategy and Digital Footprint",
            "sessionCode": "S457",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:30:00.000Z",
            "sessionId": "1651011983723001q1bS",
            "sessionStartTime": "2022-10-19T20:00:00.000Z",
            "sessionTimeId": "1658957034240001KBTF",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-cultivate-creativity-mix-traditional-photograp-s101.html",
            "id": "54c5a1ab-8bbc-3f69-aae2-9a045594a03e",
            "sortDate": "2022-10-19T20:00:00.000Z",
            "sessionTitle": "Cultivate Creativity: Mix Traditional Photography, CGI, & 3D",
            "sessionCode": "S101",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:30:00.000Z",
            "sessionId": "1651011982326001qNTv",
            "sessionStartTime": "2022-10-19T20:00:00.000Z",
            "sessionTimeId": "1658956737294001H5o4",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/substance-3d-assets",
                    "title": "Substance 3D Assets"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-building-student-skill-confidence-in-digital-st-s201.html",
            "id": "6661e24d-7390-366a-85eb-72af6ba35e22",
            "sortDate": "2022-10-19T20:00:00.000Z",
            "sessionTitle": "Building Student Skill & Confidence in Digital Storytelling",
            "sessionCode": "S201",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:30:00.000Z",
            "sessionId": "164918886161400156gp",
            "sessionStartTime": "2022-10-19T20:00:00.000Z",
            "sessionTimeId": "1660597335363001DZHY",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-meet-the-max-speaker-zipeng-zhu-al607.html",
            "id": "ce0f8be9-f17d-393b-b61b-b49c6be9ea98",
            "sortDate": "2022-10-19T20:00:00.000Z",
            "sessionTitle": "Meet the MAX Speaker: Zipeng Zhu",
            "sessionCode": "AL607",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:30:00.000Z",
            "sessionId": "16589716845120018A1B",
            "sessionStartTime": "2022-10-19T20:00:00.000Z",
            "sessionTimeId": "16589745457490012RLW",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-using-vr-to-improve-workflow-efficiency-and-qu-s726.html",
            "id": "8600b0d5-4aa1-3e13-ad41-696258377f8d",
            "isFeatured": true,
            "sortDate": "2022-10-19T20:00:00.000Z",
            "sessionTitle": "Unlock the Future of Immersive Storytelling with Creators",
            "sessionCode": "S726",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:30:00.000Z",
            "sessionId": "16515987184860016wnT",
            "sessionStartTime": "2022-10-19T20:00:00.000Z",
            "sessionTimeId": "1655851464263001Qdqw",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-attentiongrabbing-graphics-social-media-animat-s306.html",
            "id": "020d121d-c80d-3b68-b44f-4d6c6257a131",
            "isFeatured": true,
            "sortDate": "2022-10-19T20:00:00.000Z",
            "sessionTitle": "Attention-Grabbing Graphics: Social Media Animation",
            "sessionCode": "S306",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T20:30:00.000Z",
            "sessionId": "1651011982838001qHvR",
            "sessionStartTime": "2022-10-19T20:00:00.000Z",
            "sessionTimeId": "1658535523043001nphW",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-adobe-xd-pro-tips-accelerating-design-and-prot-s500.html",
            "id": "95bc89a3-069c-3c0d-9ebe-5e24566447e7",
            "sortDate": "2022-10-19T20:30:00.000Z",
            "sessionTitle": "Adobe XD Pro Tips: Accelerating Design and Prototype Workflows",
            "sessionCode": "S500",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:00:00.000Z",
            "sessionId": "1651011983757001q2Wq",
            "sessionStartTime": "2022-10-19T20:30:00.000Z",
            "sessionTimeId": "1659064468488001H0G6",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creativity-as-fuel-for-student-centered-learni-s204.html",
            "id": "bd581a11-8e96-3965-9686-8d8b4020d2aa",
            "sortDate": "2022-10-19T20:30:00.000Z",
            "sessionTitle": "Creativity as Fuel for Student Centered Learning and Wellbeing",
            "sessionCode": "S204",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:00:00.000Z",
            "sessionId": "16491888617090015Isk",
            "sessionStartTime": "2022-10-19T20:30:00.000Z",
            "sessionTimeId": "1657745757046001E4l8",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-mouthwatering-food-photos-with-lightr-s403.html",
            "id": "a60f13cf-c38c-3386-b314-3dcd35dd82a8",
            "isFeatured": true,
            "sortDate": "2022-10-19T20:30:00.000Z",
            "sessionTitle": "Creating Mouthwatering Food Photos with Lightroom",
            "sessionCode": "S403",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:00:00.000Z",
            "sessionId": "1651011983265001qKrz",
            "sessionStartTime": "2022-10-19T20:30:00.000Z",
            "sessionTimeId": "1657745417161001qmlW",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-five-trends-every-creative-leader-should-follow-s720.html",
            "id": "a15e9eeb-f91d-30b2-ab38-468b5723126a",
            "sortDate": "2022-10-19T20:30:00.000Z",
            "sessionTitle": "Five Trends Every Creative Leader Should Follow in 2023",
            "sessionCode": "S720",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:00:00.000Z",
            "sessionId": "165159871752400161FN",
            "sessionStartTime": "2022-10-19T20:30:00.000Z",
            "sessionTimeId": "166147036302300159nG",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/audience-type/it",
                    "title": "IT"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-build-your-own-personal-brand-with-color-me-co-s6001.html",
            "id": "baae2224-8b30-3fcc-82de-d1f5f86355c0",
            "isFeatured": true,
            "sortDate": "2022-10-19T20:30:00.000Z",
            "sessionTitle": "Build Your Own Personal Brand with Color Me Courtney",
            "sessionCode": "S6001",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "16491890234560019jyX",
            "sessionStartTime": "2022-10-19T20:30:00.000Z",
            "sessionTimeId": "16594139683940010w6I",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-gratitude-gratitude-gratitude-it-takes-a-villag-s6320.html",
            "id": "874db655-f315-3dcc-b52e-8e007917328d",
            "isFeatured": true,
            "sortDate": "2022-10-19T20:30:00.000Z",
            "sessionTitle": "Gratitude, Gratitude, Gratitude: It Takes a Village",
            "sessionCode": "S6320",
            "sessionDuration": "60",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "16491888625420015IP4",
            "sessionStartTime": "2022-10-19T20:30:00.000Z",
            "sessionTimeId": "1657576336927001brXw",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-illustration-and-al608.html",
            "id": "1799835b-341e-3283-90b4-dfbb2044c19f",
            "sortDate": "2022-10-19T20:45:00.000Z",
            "sessionTitle": "First Takes from the Community: Illustration and Digital Painting",
            "sessionCode": "AL608",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "1658971835087001H0sI",
            "sessionStartTime": "2022-10-19T20:45:00.000Z",
            "sessionTimeId": "1658974655908001Hd8h",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-create-experimental-lettering-with-fres-s217.html",
            "id": "19cec695-cf35-3663-95a5-0296d7ae10e1",
            "sortDate": "2022-10-19T21:00:00.000Z",
            "sessionTitle": "How to Create Experimental Lettering with Fresco",
            "sessionCode": "S217",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "1652999635289001jn0E",
            "sessionStartTime": "2022-10-19T21:00:00.000Z",
            "sessionTimeId": "1657745964909001em5B",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-fast-cuts-and-creativity-quick-video-editing-t-s604.html",
            "id": "887fd119-edd7-38b0-a690-2d12cf8f3c82",
            "isFeatured": true,
            "sortDate": "2022-10-19T21:00:00.000Z",
            "sessionTitle": "Fast Cuts and Creativity: Quick Video Editing Techniques",
            "sessionCode": "S604",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "164918886361700154DP",
            "sessionStartTime": "2022-10-19T21:00:00.000Z",
            "sessionTimeId": "1657745248928001GW3w",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creatively-connected-the-importance-of-agile-w-s722.html",
            "id": "e9b407ec-ba49-378b-af7f-d558ed9187cb",
            "sortDate": "2022-10-19T21:00:00.000Z",
            "sessionTitle": "Creativity Connected: The Importance of Agile Workflows",
            "sessionCode": "S722",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "16515987178370016nqY",
            "sessionStartTime": "2022-10-19T21:00:00.000Z",
            "sessionTimeId": "1655758889717001igUM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-photoshop-tips-tricks-elevate-your-graphic-des-s304.html",
            "id": "f06f4a01-43f4-369d-83cb-ca007fcc0319",
            "isFeatured": true,
            "sortDate": "2022-10-19T21:00:00.000Z",
            "sessionTitle": "Photoshop Tips & Tricks: Elevate Your Graphic Design Style",
            "sessionCode": "S304",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T21:30:00.000Z",
            "sessionId": "1651011982754001qLI3",
            "sessionStartTime": "2022-10-19T21:00:00.000Z",
            "sessionTimeId": "1658956903282001KQzT",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-increasing-productivity-and-collaboration-with-s452.html",
            "id": "083acbcb-0115-326b-a2f2-6e1de031f3ca",
            "isFeatured": true,
            "sortDate": "2022-10-19T21:30:00.000Z",
            "sessionTitle": "Increasing Productivity and Collaboration with Adobe Express",
            "sessionCode": "S452",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:00:00.000Z",
            "sessionId": "1651011983542001qwuf",
            "sessionStartTime": "2022-10-19T21:30:00.000Z",
            "sessionTimeId": "1657746182009001qPKl",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-digital-life-for-the-next-generation-media-and-s203.html",
            "id": "010e3bb9-9157-389d-bf0a-bad610851ea1",
            "isFeatured": true,
            "sortDate": "2022-10-19T21:30:00.000Z",
            "sessionTitle": "Digital Life for The Next Generation: Media and Technology",
            "sessionCode": "S203",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:00:00.000Z",
            "sessionId": "16491888616770015IfH",
            "sessionStartTime": "2022-10-19T21:30:00.000Z",
            "sessionTimeId": "1658968225628001HZNM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creative-strategy-that-delivers-fewer-tasks-mor-s154.html",
            "id": "0c9045b4-5857-3033-a869-f136cae34118",
            "isFeatured": true,
            "sortDate": "2022-10-19T21:30:00.000Z",
            "sessionTitle": "Creative Strategy That Delivers: Fewer Tasks, More Action",
            "sessionCode": "S154",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:00:00.000Z",
            "sessionId": "1661190396689001miw2",
            "sessionStartTime": "2022-10-19T21:30:00.000Z",
            "sessionTimeId": "1661190680211001SAbd",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-how-to-avoid-employee-burnout-while-accelerati-s724.html",
            "id": "78b4d6ca-36d4-34d1-b175-2fe823ee6901",
            "sortDate": "2022-10-19T21:30:00.000Z",
            "sessionTitle": "How to Avoid Employee Burnout While Accelerating Output",
            "sessionCode": "S724",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:00:00.000Z",
            "sessionId": "165159871816500166ak",
            "sessionStartTime": "2022-10-19T21:30:00.000Z",
            "sessionTimeId": "1655759006911001o0fK",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/acrobat",
                    "title": "Acrobat"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/audience-type/it",
                    "title": "IT"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-first-takes-from-the-community-adobe-express-al609.html",
            "id": "a5b229a8-93a5-337b-8d85-3246878581d6",
            "sortDate": "2022-10-19T21:45:00.000Z",
            "sessionTitle": "First Takes from the Community: Adobe Express",
            "sessionCode": "AL609",
            "sessionDuration": "45",
            "sessionEndTime": "2022-10-19T22:30:00.000Z",
            "sessionId": "1658972000831001HRHn",
            "sessionStartTime": "2022-10-19T21:45:00.000Z",
            "sessionTimeId": "1658974754828001HcGy",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-animated-characters-for-social-media-with-char-s602.html",
            "id": "21eea00b-98a2-3c96-abed-113b8aa6a972",
            "isFeatured": true,
            "sortDate": "2022-10-19T22:00:00.000Z",
            "sessionTitle": "Animated Characters for Social Media with Character Animator",
            "sessionCode": "S602",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:30:00.000Z",
            "sessionId": "1651011984001001qF5C",
            "sessionStartTime": "2022-10-19T22:00:00.000Z",
            "sessionTimeId": "1657745350536001oC9b",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/products/character-animator",
                    "title": "Character Animator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-editing-beautiful-nature-and-landscape-photos-s401.html",
            "id": "ca819578-8230-32ed-8069-dbf5d2df7b50",
            "sortDate": "2022-10-19T22:00:00.000Z",
            "sessionTitle": "Editing Beautiful Nature and Landscape Photos in Lightroom",
            "sessionCode": "S401",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:30:00.000Z",
            "sessionId": "1651011983179001qNnW",
            "sessionStartTime": "2022-10-19T22:00:00.000Z",
            "sessionTimeId": "1657746235043001sgkN",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-leveraging-ai-to-extend-your-creative-toolkit-s153.html",
            "id": "bac50063-7a14-3d4e-be87-552270e8b2a9",
            "sortDate": "2022-10-19T22:00:00.000Z",
            "sessionTitle": "Leveraging AI to Extend Your Creative Toolkit",
            "sessionCode": "S153",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:30:00.000Z",
            "sessionId": "1657900339260001ZxWa",
            "sessionStartTime": "2022-10-19T22:00:00.000Z",
            "sessionTimeId": "1660279599420001uVjM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-enabling-innovative-and-creative-workflows-s716.html",
            "id": "49e03ce7-fb05-3942-9988-dcfd3fb94571",
            "sortDate": "2022-10-19T22:00:00.000Z",
            "sessionTitle": "Enabling Innovative and Creative Workflows",
            "sessionCode": "S716",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T22:30:00.000Z",
            "sessionId": "16491888644930015lp4",
            "sessionStartTime": "2022-10-19T22:00:00.000Z",
            "sessionTimeId": "1663633094885001OKJx",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/audience-type/it",
                    "title": "IT"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/products/adobe-sign",
                    "title": "Adobe Sign"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-drawing-everyday-objects-with-adobe-fresco-s216.html",
            "id": "227521bb-3708-3001-83fb-a3c479cf4b78",
            "isFeatured": true,
            "sortDate": "2022-10-19T22:30:00.000Z",
            "sessionTitle": "Drawing Everyday Objects with Adobe Fresco",
            "sessionCode": "S216",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:00:00.000Z",
            "sessionId": "1652999635252001jXv7",
            "sessionStartTime": "2022-10-19T22:30:00.000Z",
            "sessionTimeId": "1657766221202001d7yX",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-interactive-prototypes-with-adobe-xd-s503.html",
            "id": "0c314591-12ae-3e37-afcd-7e1176244935",
            "sortDate": "2022-10-19T22:30:00.000Z",
            "sessionTitle": "Creating Interactive Prototypes with Adobe XD",
            "sessionCode": "S503",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:00:00.000Z",
            "sessionId": "1651011983878001qCYm",
            "sessionStartTime": "2022-10-19T22:30:00.000Z",
            "sessionTimeId": "1657746055034001e0jp",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creating-characters-with-vr-modeling-in-substa-s103.html",
            "id": "0e9194ac-4cae-3ed6-b9b7-fb3e9c6a82ff",
            "sortDate": "2022-10-19T22:30:00.000Z",
            "sessionTitle": "Creating Characters with VR Modeling in Substance 3D Modeler",
            "sessionCode": "S103",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:00:00.000Z",
            "sessionId": "1651011982394001qwfn",
            "sessionStartTime": "2022-10-19T22:30:00.000Z",
            "sessionTimeId": "1657827181857001NKIH",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/substance-3d-modeler",
                    "title": "Substance 3D Modeler"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-creative-collaboration-across-a-global-team-s608.html",
            "id": "00ba1b2c-8555-3260-b787-8c04a5a2a452",
            "isFeatured": true,
            "sortDate": "2022-10-19T22:30:00.000Z",
            "sessionTitle": "Creative Collaboration Across a Global Team",
            "sessionCode": "S608",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:00:00.000Z",
            "sessionId": "16491890235210019vwo",
            "sessionStartTime": "2022-10-19T22:30:00.000Z",
            "sessionTimeId": "1659413544356001eYLV",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-discover-the-golden-secrets-of-lettering-s300.html",
            "id": "3285ca12-1593-3d91-a35b-dd10cc808e97",
            "isFeatured": true,
            "sortDate": "2022-10-19T22:30:00.000Z",
            "sessionTitle": "Discover the Golden Secrets of Lettering",
            "sessionCode": "S300",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:00:00.000Z",
            "sessionId": "1651011982588001q1vt",
            "sessionStartTime": "2022-10-19T22:30:00.000Z",
            "sessionTimeId": "1658872149191001iANC",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-meet-the-max-speaker-rebecca-ferguson-al610.html",
            "id": "22720049-c5d4-3dc0-8c59-b0408397e03f",
            "sortDate": "2022-10-19T22:45:00.000Z",
            "sessionTitle": "Meet the MAX Speaker: Fergie",
            "sessionCode": "AL610",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:15:00.000Z",
            "sessionId": "1658972184107001Hmhg",
            "sessionStartTime": "2022-10-19T22:45:00.000Z",
            "sessionTimeId": "16589748535970018R6W",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-fostering-the-digital-skills-of-health-sciences-s207.html",
            "id": "855c8eb1-43ff-3f0c-8c3f-7fa44d993700",
            "sortDate": "2022-10-19T23:00:00.000Z",
            "sessionTitle": "Fostering the Digital Skills of Health Sciences Students",
            "sessionCode": "S207",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:30:00.000Z",
            "sessionId": "16491888618120015bJ8",
            "sessionStartTime": "2022-10-19T23:00:00.000Z",
            "sessionTimeId": "1661375206544001W8PX",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-after-effects-101-expanding-your-skills-with-m-s603.html",
            "id": "646f2b89-9c81-3d8c-8a18-f806b2eb2a9f",
            "isFeatured": true,
            "sortDate": "2022-10-19T23:00:00.000Z",
            "sessionTitle": "After Effects 101: Expanding Your Skills with Motion Design",
            "sessionCode": "S603",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-19T23:30:00.000Z",
            "sessionId": "1651011984036001qhxm",
            "sessionStartTime": "2022-10-19T23:00:00.000Z",
            "sessionTimeId": "1657747035405001qqYk",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-using-metrics-to-build-a-successful-social-medi-s450.html",
            "id": "e7394abd-ff19-38b8-a925-412d4c85c982",
            "isFeatured": true,
            "sortDate": "2022-10-19T23:30:00.000Z",
            "sessionTitle": "Using Metrics to Build a Successful Social Media Strategy",
            "sessionCode": "S450",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T00:00:00.000Z",
            "sessionId": "1651011983460001q2P1",
            "sessionStartTime": "2022-10-19T23:30:00.000Z",
            "sessionTimeId": "1657746306380001ofXn",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-meet-the-max-speaker-charmaine-jennings-al611.html",
            "id": "4f4d62b9-22dc-3cd6-8c52-68c4e2d06f5e",
            "sortDate": "2022-10-19T23:30:00.000Z",
            "sessionTitle": "Meet the MAX Speaker: Charmaine Jennings",
            "sessionCode": "AL611",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T00:00:00.000Z",
            "sessionId": "1658972333811001N2tI",
            "sessionStartTime": "2022-10-19T23:30:00.000Z",
            "sessionTimeId": "1658974966713001HQhb",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-from-fulltime-to-freelance-a-photographers-jou-s408.html",
            "id": "ef3b51b5-d427-32c4-87a3-137819f197ea",
            "isFeatured": true,
            "sortDate": "2022-10-19T23:30:00.000Z",
            "sessionTitle": "From Full-Time to Freelance: A Photographer’s Journey",
            "sessionCode": "S408",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T00:00:00.000Z",
            "sessionId": "1654704264085001lgoh",
            "sessionStartTime": "2022-10-19T23:30:00.000Z",
            "sessionTimeId": "1657766133269001a6mj",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/na-learn-skills-to-build-an-international-brand-on-s308.html",
            "id": "41f988dd-55d1-35c1-b34c-b0cf41502f2b",
            "isFeatured": true,
            "sortDate": "2022-10-19T23:30:00.000Z",
            "sessionTitle": "Learn Skills to Build an International Brand & Online Presence",
            "sessionCode": "S308",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T00:00:00.000Z",
            "sessionId": "1651011982923001qICq",
            "sessionStartTime": "2022-10-19T23:30:00.000Z",
            "sessionTimeId": "1659545516635001Ivje",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/category/running-your-business",
                    "title": "Running Your Business"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-artistic-scenes-sneak-mb9-7.html",
            "id": "75bbf7aa-1904-3b89-be1b-ec63fc1420e3",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Artistic Scenes Sneak",
            "sessionCode": "MB9-7",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070181001nQtg",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244829155001TdAh",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-motion-mix-sneak-mb9-5.html",
            "id": "fb6c6421-aa62-3af0-b104-2401e0cae835",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Motion Mix Sneak",
            "sessionCode": "MB9-5",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070061001nk2t",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244734418001Sug0",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-magnetic-type-sneak-mb9-3.html",
            "id": "5d5cba83-5ccd-326c-9030-54faf731bd9c",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Magnetic Type Sneak",
            "sessionCode": "MB9-3",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070134001nji5",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244642150001e2wI",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-vector-edge-sneak-mb9-4.html",
            "id": "d43d9dfe-b284-3a8f-b80b-cc21db48265d",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Vector Edge Sneak",
            "sessionCode": "MB9-4",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070098001nCp5",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244682657001TIV8",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-made-in-the-shade-sneak-mb9-10.html",
            "id": "b267d85b-70e9-3213-93b3-c7beaff399d5",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Made In The Shade Sneak",
            "sessionCode": "MB9-10",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070286001ngqI",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667245033060001fFv0",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-clever-composites-sneak-mb9-1.html",
            "id": "e5175d36-603c-3c95-8a8c-6661a17a0413",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Clever Composites Sneak",
            "sessionCode": "MB9-1",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070216001nlJs",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244526460001ZFw8",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/adobe-max-sneaks-mb9.html",
            "id": "268b3842-7e90-3b09-a723-4e452a87ae0c",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "MAX Sneaks",
            "sessionCode": "MB9",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-20T02:00:00.000Z",
            "sessionId": "1655232069911001nHRw",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667242939065001TFGI",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/on-demand",
                    "title": "On-Demand"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-instant-add-sneak-mb9-2.html",
            "id": "c2971ee6-21a5-3422-a9d4-230fa8ab5906",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Instant Add Sneak",
            "sessionCode": "MB9-2",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070025001nmLA",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244598895001Xuzv",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-all-of-me-sneak-mb9-8.html",
            "id": "684485c1-7f58-350d-af57-5ae936f3ac12",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project All of Me Sneak",
            "sessionCode": "MB9-8",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232070251001nJNR",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244887515001X4Dm",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-beyond-the-seen-sneak-mb9-9.html",
            "id": "108b0929-c3d8-3141-b549-d290da122507",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Beyond the Seen Sneak",
            "sessionCode": "MB9-9",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232069985001necy",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244938418001TZei",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/project-blink-sneak-mb9-6.html",
            "id": "a9f538c8-ff92-3481-9c3c-3af713c976b0",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "Project Blink Sneak",
            "sessionCode": "MB9-6",
            "sessionDuration": "10",
            "sessionEndTime": "2022-10-20T00:40:00.000Z",
            "sessionId": "1655232069950001nEVn",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1667244787841001Sikf",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/max-sneaks-asl-mb6-1.html",
            "id": "f96cfcc2-d145-3390-be2b-155ff4d6611a",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "MAX Sneaks with Kevin Hart & Bria Alexander - ASL",
            "sessionCode": "MB6-1",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-20T02:00:00.000Z",
            "sessionId": "1663262770013001EgTJ",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1663607717408001xcEe",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/max-sneaks-mb6.html",
            "id": "3c111379-5fb4-3850-85c8-7ce7d3a6e7b2",
            "sortDate": "2022-10-20T00:30:00.000Z",
            "sessionTitle": "MAX Sneaks with Kevin Hart & Bria Alexander",
            "sessionCode": "MB6",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-20T02:00:00.000Z",
            "sessionId": "1655232069795001n8Aw",
            "sessionStartTime": "2022-10-20T00:30:00.000Z",
            "sessionTimeId": "1657822394103001Nq6j",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/day/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/asia-pacific-keynote-mb7.html",
            "id": "b5c058e7-cbfd-3364-a52c-b44b2784050c",
            "sortDate": "2022-10-20T01:30:00.000Z",
            "sessionTitle": "Asia Pacific Keynote",
            "sessionCode": "MB7",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-20T03:00:00.000Z",
            "sessionId": "1655232069834001nWoB",
            "sessionStartTime": "2022-10-20T01:30:00.000Z",
            "sessionTimeId": "16575841266510019Y4H",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-finding-inspiration-for-your-creative-journey-mb8.html",
            "id": "ef2df6ee-fb4a-3f5f-81c1-a29e81fc958d",
            "sortDate": "2022-10-20T03:00:00.000Z",
            "sessionTitle": "Finding Inspiration for Your Creative Journey",
            "sessionCode": "MB8",
            "sessionDuration": "90",
            "sessionEndTime": "2022-10-20T04:30:00.000Z",
            "sessionId": "1655232069874001n16F",
            "sessionStartTime": "2022-10-20T03:00:00.000Z",
            "sessionTimeId": "1660953632189001S0jE",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/event-session-type/big-tent/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-a-new-creative-approach-designing-with-your-w-s909.html",
            "id": "7f3f16df-d5ad-3605-92aa-7cc59f659e1a",
            "isFeatured": true,
            "sortDate": "2022-10-20T05:00:00.000Z",
            "sessionTitle": "A New Creative Approach: Designing with Your Whole Body",
            "sessionCode": "S909",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T05:30:00.000Z",
            "sessionId": "1652997315322001jjCf",
            "sessionStartTime": "2022-10-20T05:00:00.000Z",
            "sessionTimeId": "1661211523906001mouu",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                "title": "Drawing, Painting, and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/primary-track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-creating-interactive-prototypes-with-adobe-xd-s503.html",
            "id": "9efe2911-396d-3ead-98af-967aeaeaeb54",
            "sortDate": "2022-10-20T05:00:00.000Z",
            "sessionTitle": "Creating Interactive Prototypes with Adobe XD",
            "sessionCode": "S503",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T05:30:00.000Z",
            "sessionId": "1651011983878001qCYm",
            "sessionStartTime": "2022-10-20T05:00:00.000Z",
            "sessionTimeId": "1659723503576001P9KR",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/products/xd",
                    "title": "XD"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-designing-creative-collaboration-in-a-remote-s501.html",
            "id": "36bbbe73-f6a0-3de4-afe1-9d0ace68c79c",
            "isFeatured": true,
            "sortDate": "2022-10-20T05:00:00.000Z",
            "sessionTitle": "Designing Creative Collaboration in a Remote Workplace",
            "sessionCode": "S501",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T05:30:00.000Z",
            "sessionId": "1651011983796001q4M5",
            "sessionStartTime": "2022-10-20T05:00:00.000Z",
            "sessionTimeId": "1660782910358001G9jF",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/ui-and-ux",
                "title": "UI and UX"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/primary-track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-meet-max-speaker-pablo-munoz-gomez-al617.html",
            "id": "a0368f6e-af16-323b-a106-6d3512c21d92",
            "sortDate": "2022-10-20T05:00:00.000Z",
            "sessionTitle": "Meet MAX Speaker: Pablo Munoz Gomez",
            "sessionCode": "AL617",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T05:30:00.000Z",
            "sessionId": "1660108077397001sGVQ",
            "sessionStartTime": "2022-10-20T05:00:00.000Z",
            "sessionTimeId": "1660108413824001z5FA",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-from-fulltime-to-freelance-a-photographers-jo-s408.html",
            "id": "ba553330-a312-30e7-b11b-73cad7d3cda4",
            "isFeatured": true,
            "sortDate": "2022-10-20T05:00:00.000Z",
            "sessionTitle": "From Full-Time to Freelance: A Photographer’s Journey",
            "sessionCode": "S408",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T05:30:00.000Z",
            "sessionId": "1654704264085001lgoh",
            "sessionStartTime": "2022-10-20T05:00:00.000Z",
            "sessionTimeId": "1659049234790001wEQP",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/photography",
                "title": "Photography"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-how-to-create-scrollstopping-social-media-gra-s901.html",
            "id": "0e3d84af-0fe7-3fba-9b9c-d2c5d625f4a3",
            "sortDate": "2022-10-20T05:30:00.000Z",
            "sessionTitle": "How to Create Scroll-Stopping Social Media Graphics",
            "sessionCode": "S901",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:00:00.000Z",
            "sessionId": "1652997315021001jNng",
            "sessionStartTime": "2022-10-20T05:30:00.000Z",
            "sessionTimeId": "1658875493397001gq8F",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-easy-augmented-reality-interactive-illustrati-s903.html",
            "id": "5762a5a1-c1bc-3f62-bbd3-6f97e482aa88",
            "isFeatured": true,
            "sortDate": "2022-10-20T05:30:00.000Z",
            "sessionTitle": "Easy Augmented Reality: Interactive Illustrations with Aero",
            "sessionCode": "S903",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:00:00.000Z",
            "sessionId": "1652997315093001juga",
            "sessionStartTime": "2022-10-20T05:30:00.000Z",
            "sessionTimeId": "16588752906610012KXO",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-creative-collaboration-across-a-global-team-s608.html",
            "id": "0cb5dd3d-042f-3348-9d9f-c2901a260642",
            "isFeatured": true,
            "sortDate": "2022-10-20T05:30:00.000Z",
            "sessionTitle": "Creative Collaboration Across a Global Team",
            "sessionCode": "S608",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:00:00.000Z",
            "sessionId": "16491890235210019vwo",
            "sessionStartTime": "2022-10-20T05:30:00.000Z",
            "sessionTimeId": "1660782833738001dclB",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/max/category/luminary",
                    "title": "Luminary"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-animate-stunning-graphics-using-only-premiere-s905.html",
            "id": "5f622001-e242-3f8e-bdde-9e8d78669a56",
            "sortDate": "2022-10-20T05:30:00.000Z",
            "sessionTitle": "Animate Stunning Graphics Using Only Premiere Pro",
            "sessionCode": "S905 ",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:00:00.000Z",
            "sessionId": "1652997315178001j4Ft",
            "sessionStartTime": "2022-10-20T05:30:00.000Z",
            "sessionTimeId": "1658876060509001Wdo3",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-behind-the-magic-engaging-animation-and-motio-s907.html",
            "id": "f88d3315-62b9-316c-b1f2-a35bfdb8b656",
            "sortDate": "2022-10-20T06:00:00.000Z",
            "sessionTitle": "Behind the Magic: Engaging Animation and Motion Processes",
            "sessionCode": "S907",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:30:00.000Z",
            "sessionId": "1652997315250001j4q4",
            "sessionStartTime": "2022-10-20T06:00:00.000Z",
            "sessionTimeId": "165887619791800126Sd",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-unlocking-the-value-of-design-advancing-your-s152.html",
            "id": "2cc9510b-c945-3fd8-956f-b2242e941649",
            "isFeatured": true,
            "sortDate": "2022-10-20T06:00:00.000Z",
            "sessionTitle": "Unlocking the Value of Design: Advancing Your Design Practice",
            "sessionCode": "S152",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:30:00.000Z",
            "sessionId": "1651011982518001q7eu",
            "sessionStartTime": "2022-10-20T06:00:00.000Z",
            "sessionTimeId": "16607829682160018Jai",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/audience-type/ui-and-ux",
                    "title": "UI & UX"
                },
                {
                    "tagId": "caas:events/max/category/collaborating-with-your-team",
                    "title": "Collaborating with Your Team"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/track/ui-and-ux",
                    "title": "UI and UX"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-how-to-manage-burnout-and-protect-your-creati-s902.html",
            "id": "068a6925-c727-3064-83c7-e567a5619aad",
            "isFeatured": true,
            "sortDate": "2022-10-20T06:00:00.000Z",
            "sessionTitle": "How to Manage Burnout and Protect your Creative Well-being",
            "sessionCode": "S902",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:30:00.000Z",
            "sessionId": "1652997315058001j16V",
            "sessionStartTime": "2022-10-20T06:00:00.000Z",
            "sessionTimeId": "16589483309530018VZi",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-learn-skills-to-build-an-international-brand-s308.html",
            "id": "08188489-7fc7-3c50-a72f-45a1c4a40c30",
            "isFeatured": true,
            "sortDate": "2022-10-20T06:00:00.000Z",
            "sessionTitle": "Learn Skills to Build an International Brand & Online Presence",
            "sessionCode": "S308",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T06:30:00.000Z",
            "sessionId": "1651011982923001qICq",
            "sessionStartTime": "2022-10-20T06:00:00.000Z",
            "sessionTimeId": "1659723092369001A73H",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/max/category/running-your-business",
                    "title": "Running Your Business"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-creating-ar-effects-with-adobe-and-tiktoks-ef-s715.html",
            "id": "34249ee3-c3e6-361d-9d0e-d67704023b45",
            "isFeatured": true,
            "sortDate": "2022-10-20T06:30:00.000Z",
            "sessionTitle": "Creating AR Effects with Adobe and TikTok’s Effect House",
            "sessionCode": "S715",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T07:00:00.000Z",
            "sessionId": "16491888644540015ee5",
            "sessionStartTime": "2022-10-20T06:30:00.000Z",
            "sessionTimeId": "1660782687428001zQOr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-how-to-create-concept-illustration-with-3d-so-s904.html",
            "id": "930b1919-5e70-323e-a884-cc4f3ed73397",
            "sortDate": "2022-10-20T06:30:00.000Z",
            "sessionTitle": "Creating Emotive Artwork Using Adobe 3D Tools",
            "sessionCode": "S904",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T07:00:00.000Z",
            "sessionId": "1652997315142001ja04",
            "sessionStartTime": "2022-10-20T06:30:00.000Z",
            "sessionTimeId": "1658875426607001zLJh",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d-and-ar",
                "title": "3D and AR"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/products/substance-3d-sampler",
                    "title": "Substance 3D Sampler"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/track/3d-and-ar",
                    "title": "3D and AR"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-creating-seamless-2d-looping-animations-s908.html",
            "id": "ff414979-92f3-3c2c-908e-e0b6a1c0bf8b",
            "sortDate": "2022-10-20T06:30:00.000Z",
            "sessionTitle": "Creating Seamless 2D Looping Animations ",
            "sessionCode": "S908",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T07:00:00.000Z",
            "sessionId": "1652997315286001jlSX",
            "sessionStartTime": "2022-10-20T06:30:00.000Z",
            "sessionTimeId": "1661213261343001CBqi",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                "title": "Video, Audio, and Motion"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-meet-the-max-speaker-gemma-obrien-al619.html",
            "id": "7a6df8c8-399b-3347-ae87-9b3618edc82d",
            "sortDate": "2022-10-20T06:30:00.000Z",
            "sessionTitle": "Meet the MAX Speaker: Gemma O'Brien",
            "sessionCode": "AL619",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T07:00:00.000Z",
            "sessionId": "1660108723462001zAkN",
            "sessionStartTime": "2022-10-20T06:30:00.000Z",
            "sessionTimeId": "1660108947284001e2hG",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/max/track/drawing-painting-and-illustration",
                    "title": "Drawing, Painting, and Illustration"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2022/sessions/apac-how-to-create-a-digital-artwork-masterpiece-i-s906.html",
            "id": "7ff7c82b-a6b1-3d24-8628-e65b5a1b23a4",
            "isFeatured": true,
            "sortDate": "2022-10-20T06:30:00.000Z",
            "sessionTitle": "How to Create a Digital Artwork Masterpiece in Photoshop",
            "sessionCode": "S906",
            "sessionDuration": "30",
            "sessionEndTime": "2022-10-20T07:00:00.000Z",
            "sessionId": "1652997315214001jFab",
            "sessionStartTime": "2022-10-20T06:30:00.000Z",
            "sessionTimeId": "1658876141047001gnc8",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design",
                "title": "Graphic Design"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/session-format/virtual",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/year/2022",
                    "title": "2022"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design",
                    "title": "Graphic Design"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        }
    ]
};

// ============================================================================
// HARDCODED CONFIG - Simulates AEM Dialog values
// In real Digital Agenda, these come from AEM component dialog
// ============================================================================
const AGENDA_CONFIG = {
    // Tracks Configuration (from AEM dialog "Tracks Collection Tags")
    tracks: [
        { id: 'live-broadcast', tagId: 'caas:events/max/primary-track/live-broadcast', title: 'Mainstage Broadcast', description: 'Don\'t miss the Mainstage Broadcast of Keynotes, Sneaks, Creativity Super Sessions, and Luminary Sessions.', color: '#FF6B00' },
        { id: 'adobe-live-at-max', tagId: 'caas:events/max/primary-track/adobe-live-at-max', title: 'Adobe Live @ MAX', description: 'Visit your favorite MAX speakers online to get your questions answered.', color: '#1473E6' },
        { id: 'creativity-and-design-in-business', tagId: 'caas:events/max/primary-track/creativity-and-design-in-business', title: 'Creativity and Design in Business', description: 'Inspiring speakers share their expertise and insights about creative leadership.', color: '#00A38F' },
        { id: 'drawing-painting-and-illustration', tagId: 'caas:events/max/primary-track/drawing-painting-and-illustration', title: 'Drawing, Painting, and Illustration', description: 'Learn how to create stunning illustrations and digital paintings.', color: '#9D22C1' },
        { id: 'graphic-design', tagId: 'caas:events/max/primary-track/graphic-design', title: 'Graphic Design', description: 'Bring your creative vision to life with new generative AI tools.', color: '#E63946' },
        { id: 'ui-and-ux', tagId: 'caas:events/max/primary-track/ui-and-ux', title: 'UI and UX', description: 'Design exceptional user experiences and interfaces.', color: '#00C853' },
        { id: '3d-and-ar', tagId: 'caas:events/max/primary-track/3d-and-ar', title: '3D and AR', description: 'Add the power of 3D to your design skillset and take your career to new heights.', color: '#FF5722' },
        { id: 'video-audio-and-motion', tagId: 'caas:events/max/primary-track/video-audio-and-motion', title: 'Video, Audio, and Motion', description: 'Learn how to edit your first video and transform static graphics into motion.', color: '#9C27B0' },
        { id: 'photography', tagId: 'caas:events/max/primary-track/photography', title: 'Photography', description: 'Spark your passion for photography with sessions that will help you build your skills.', color: '#795548' },
        { id: 'social-media-and-marketing', tagId: 'caas:events/max/primary-track/social-media-and-marketing', title: 'Social Media and Marketing', description: 'Leverage the power of social media and marketing to elevate your brand.', color: '#3F51B5' },
        { id: 'education', tagId: 'caas:events/max/primary-track/education', title: 'Education', description: 'Get essential creative and generative AI skills that open doors to a brighter future.', color: '#FF9800' }
    ],
    
    // Place/Timezone Options
    places: [
        { id: 'live', name: 'Live', timezone: 'PST' },
        { id: 'americas', name: 'Americas', timezone: 'PST' },
        { id: 'emea', name: 'Europe, Middle East, and Africa', timezone: 'CET' },
        { id: 'apac', name: 'Asia Pacific', timezone: 'JST' }
    ],
    defaultPlace: 'americas',
    
    // Labels (from AEM dialog)
    labels: {
        liveLabel: 'LIVE',
        onDemandLabel: 'ON DEMAND',
        featuredLabel: 'FEATURED',
        timeZoneLabel: 'Times in',
        loadingText: 'Loading agenda...',
        noSessionsText: 'No sessions available for this day',
        prevAriaLabel: 'Previous',
        nextAriaLabel: 'Next'
    },
    
    // Styling (from AEM dialog)
    styles: {
        primaryBackgroundColor: '#F5F5F5',
        cellBorderColor: '#E0E0E0',
        cornerRadius: 4
    },
    
    // API Configuration
    api: {
        chimeraEndpoint: 'https://chimera-api.adobe.io/collection', // Placeholder
        useMockData: true // Set to false when using real API
    }
};

// Constants
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const TIME_SLOT_DURATION = 15; // 15 minutes per time slot
const VISIBLE_TIME_SLOTS = 5; // Show 5 time slots

// ============================================================================
// HELPER FUNCTIONS (replacing Dexter utilities)
// ============================================================================

/**
 * Format date to readable string
 */
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format time to readable string
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Get day key from timestamp
 */
function getDayKey(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
}

/**
 * Check if session is currently live
 */
function isSessionLive(session) {
    const now = Date.now();
    const start = new Date(session.sessionStartTime).getTime();
    const end = new Date(session.sessionEndTime).getTime();
    return now >= start && now <= end;
}

/**
 * Check if session is on demand (past session)
 */
function isSessionOnDemand(session) {
    const now = Date.now();
    const end = new Date(session.sessionEndTime).getTime();
    return now > end;
}

/**
 * Extract unique days from sessions (like Digital Agenda does)
 */
function extractDaysFromSessions(sessions) {
        const daysMap = new Map();
    
        sessions.forEach(session => {
        const startTime = new Date(session.sessionStartTime).getTime();
        const dayKey = getDayKey(startTime);
        
                if (!daysMap.has(dayKey)) {
            const date = new Date(startTime);
                    daysMap.set(dayKey, {
                id: dayKey,
                date: dayKey,
                label: formatDate(date),
                startTime: new Date(dayKey + 'T00:00:00').getTime()
            });
        }
    });
    
    return Array.from(daysMap.values()).sort((a, b) => a.startTime - b.startTime);
}

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Render day/night icon (sun or moon)
 */
function renderDayNightIcon(showSun, showMoon) {
    if (showSun) {
        return `
            <div class="daytime_icon">
                <svg viewBox="0 0 14.5 14.5" xmlns="http://www.w3.org/2000/svg">
                    <title>Sun Icon</title>
                    <g transform="translate(-562 -997)">
                        <circle cx="569.2" cy="1004.2" r="3.2" fill="currentColor"/>
                        <path d="M569.2,998.4a0.641,0.641,0,0,1,0,1.283" fill="currentColor"/>
                        <path d="M569.2,1011.315a0.641,0.641,0,0,1,0-1.283" fill="currentColor"/>
                        <path d="M576.738,1001.527a0.641,0.641,0,0,1-.907.907" fill="currentColor"/>
                        <path d="M561.062,1008.066a0.641,0.641,0,0,1,.907-.907" fill="currentColor"/>
                        <path d="M576.738,1008.066a0.641,0.641,0,0,1-.907-.907" fill="currentColor"/>
                        <path d="M561.062,1001.527a0.641,0.641,0,0,1,.907.907" fill="currentColor"/>
                        <path d="M575.195,1004.2a0.641,0.641,0,0,1,1.283,0" fill="currentColor"/>
                        <path d="M562.205,1004.2a0.641,0.641,0,0,1-1.283,0" fill="currentColor"/>
                    </g>
                </svg>
            </div>
        `;
    }
    if (showMoon) {
        return `
            <div class="daytime_icon">
                <svg viewBox="0 0 8.1 11" xmlns="http://www.w3.org/2000/svg">
                    <title>Moon Icon</title>
                    <path d="M0,8.838C0.98,10.567,3.022,11.731,5.243,11.185c0.963-0.237,1.846-0.72,2.569-1.406c-0.495,0.046-1,0.014-1.493-0.096c-1.568-0.351-2.936-1.326-3.664-2.72C2.118,5.75,2.044,4.354,2.432,3.048C1.37,3.826,0.622,5.12,0.545,6.565C0.523,7.116,0.569,7.673,0.686,8.212C0.674,8.365,0.652,8.516,0.622,8.665C0.458,8.539,0.307,8.395,0.172,8.235C0.114,8.435,0.057,8.636,0,8.838z" fill="currentColor"/>
                </svg>
            </div>
        `;
    }
    return '';
}

/**
 * Check if locale uses 24-hour format
 */
function localeUses24HourTime() {
    try {
        const formatter = new Intl.DateTimeFormat(navigator.language, { hour: 'numeric' });
        const parts = formatter.formatToParts(new Date(2020, 0, 1, 13));
        const hourPart = parts.find(part => part.type === 'hour');
        return hourPart && hourPart.value.length === 2;
    } catch (e) {
        return false;
    }
}

/**
 * Get live indicator class
 */
function getLiveIndicator() {
    return `
        <span class="agenda-block__live-indicator">
            <svg class="live-circle" width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="4" fill="currentColor"/>
            </svg>
            <span class="live-label">LIVE</span>
        </span>
    `;
}

// ============================================================================
// MAIN AGENDA BLOCK CLASS
// ============================================================================

class VanillaAgendaBlock {
    constructor(element) {
        this.element = element;
        this.config = AGENDA_CONFIG;
        
        this.state = {
            sessions: [],
            tracks: this.config.tracks,
            days: [],
            currentDay: 0,
            timeCursor: 0, // Current time offset in slots
            isMobile: window.innerWidth < 768,
            isLoading: true,
            currentPlace: this.config.defaultPlace,
            isDropdownOpen: false,
            currentTime: Date.now()
        };
        
        // Live update interval
        this.updateInterval = null;
        
        this.init();
    }

    /**
     * Initialize the agenda block
     */
    async init() {
        this.renderLoading();
        await this.fetchAndProcessData();
        this.render();
        this.attachEventListeners();
        this.setupStickyHeader();
        this.startLiveUpdates();
    }

    /**
     * Fetch data from API and process it (like Digital Agenda does)
     */
    async fetchAndProcessData() {
        try {
            // Simulate API call
            const response = await this.fetchSessions();
            
            // Process sessions (add live/onDemand flags)
            this.state.sessions = response.cards.map(session => ({
                ...session,
                isLive: isSessionLive(session),
                isOnDemand: isSessionOnDemand(session)
            }));
            
            // Extract days from sessions (not from API!)
            this.state.days = extractDaysFromSessions(this.state.sessions);
            
            this.state.isLoading = false;
        } catch (error) {
            // Handle error silently in production
            this.state.isLoading = false;
        }
    }

    /**
     * Fetch sessions from API (or mock)
     */
    async fetchSessions() {
        if (this.config.api.useMockData) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_CHIMERA_API_RESPONSE;
        } else {
            // Real API call
            const response = await fetch(this.config.api.chimeraEndpoint);
            return await response.json();
        }
    }

    /**
     * Render loading state
     */
    renderLoading() {
        this.element.innerHTML = `
            <div class="agenda-block__loading">
                <div class="agenda-block__spinner"></div>
                <p>${this.config.labels.loadingText}</p>
            </div>
        `;
    }

    /**
     * Main render function
     */
    render() {
        if (this.state.isLoading) {
            this.renderLoading();
            return;
        }

        const html = `
            <div class="agenda-block__container">
                ${this.renderHeader()}
            </div>
        `;
        
        this.element.innerHTML = html;
    }

    /**
     * Render header with day selector
     */
    renderHeader() {
        return `
            <div class="agenda-block__header">
                <div class="agenda-block__watch-nav">
                    <div class="agenda-block__watch-nav-row agenda-block__geo-row">
                        <span class="agenda-block__watch-label">Watch:</span>
                        <div class="agenda-block__place-selector">
                            <ul class="agenda-block__place-list">
                                ${this.config.places.map(place => `
                                    <li class="agenda-block__place-item">
                        <button 
                                            class="agenda-block__place-tab ${place.id === this.state.currentPlace ? 'active' : ''}"
                                            data-place-id="${place.id}">
                                            ${place.name}
                        </button>
                                    </li>
                    `).join('')}
                            </ul>
                </div>
                <div class="agenda-block__pagination">
                            ${this.renderPagination()}
                        </div>
                    </div>
                    <div class="agenda-block__watch-nav-row agenda-block__date-row">
                        <div class="agenda-block__time-header">
                            <div class="agenda-block__day-dropdown-container">
                    <button 
                                    class="agenda-block__day-dropdown-toggle ${this.state.isDropdownOpen ? 'open' : ''}"
                                    data-dropdown-toggle="day-dropdown"
                                    aria-expanded="${this.state.isDropdownOpen}">
                                    <span>${this.state.days[this.state.currentDay]?.label || 'Select day'}</span>
                                    <span class="agenda-block__day-dropdown-chevron">▼</span>
                    </button>
                                <div class="agenda-block__day-dropdown ${this.state.isDropdownOpen ? 'open' : ''}" id="day-dropdown">
                                    ${this.state.days.map((day, index) => `
                    <button 
                                            class="agenda-block__day-dropdown-item ${index === this.state.currentDay ? 'active' : ''}"
                                            data-day-index="${index}">
                                            <span>${day.label}</span>
                                            ${index === this.state.currentDay ? '<span class="agenda-block__day-checkmark">✓</span>' : ''}
                    </button>
                                    `).join('')}
                </div>
                                <div class="agenda-block__timezone-label">
                                    Date and times in IST
            </div>
                            </div>
                            ${this.renderTimeHeader()}
                        </div>
                    </div>
                </div>
            </div>
            ${this.renderTracksColumnWithGrid()}
        `;
    }

    /**
     * Render combined tracks column with grid wrapper
     */
    renderTracksColumnWithGrid() {
        return `
            <div class="agenda-block__body">
                <div class="agenda-block__tracks-column">
                    ${this.renderTracksColumn()}
                </div>
                <div class="agenda-block__grid-wrapper">
                    <div class="agenda-block__grid-container">
                        ${this.renderGrid()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render tracks column
     */
    renderTracksColumn() {
        const currentDay = this.state.days[this.state.currentDay];
        const daySessions = this.getSessionsForCurrentDay();
        
        return this.state.tracks.map((track, index) => {
            const trackSessions = daySessions.filter(s => s.sessionTrack.tagId === track.tagId);
            const numberOfRows = this.calculateNumberOfRowsForTrack(trackSessions, currentDay);
            
            return `
                <div class="agenda-block__track-label" style="border-left: 4px solid ${track.color}; height: ${numberOfRows * 140 + (numberOfRows - 1) * 6}px;">
                    <div class="agenda-block__track-title-in-label">${track.title}</div>
                    ${track.description ? `<div class="agenda-block__track-description-in-label">${track.description}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Calculate grid positions for sessions (shared logic)
     * Returns { sessionTiles, numberOfRows, occupiedCells }
     */
    calculateSessionGridPositions(sessions, currentDay) {
        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const visibleStart = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);
        
        const sessionTiles = [];
        const occupiedCells = new Set();
        
        sessions.forEach(session => {
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(session.sessionEndTime).getTime();
            const duration = endTime - startTime;
            
            const startOffset = (startTime - visibleStart) / (TIME_SLOT_DURATION * MINUTE_MS);
            const durationSlots = Math.ceil(duration / (TIME_SLOT_DURATION * MINUTE_MS));
            
            if (startOffset >= 0 && startOffset < VISIBLE_TIME_SLOTS) {
                const track = this.state.tracks.find(t => t.tagId === session.sessionTrack.tagId);
                const startColumn = Math.floor(startOffset) + 1;
                const endColumn = Math.min(startColumn + durationSlots, VISIBLE_TIME_SLOTS + 1);
                
                // Find available row for this session
                let rowNumber = 1;
                let foundRow = false;
                
                while (!foundRow && rowNumber <= 10) {
                    foundRow = true;
                    for (let col = startColumn; col < endColumn; col++) {
                        if (occupiedCells.has(`${rowNumber}-${col}`)) {
                            foundRow = false;
                            rowNumber++;
                            break;
                        }
                    }
                }
                
                // Mark cells as occupied
                for (let col = startColumn; col < endColumn; col++) {
                    occupiedCells.add(`${rowNumber}-${col}`);
                }
                
                sessionTiles.push({
                    session,
                    startColumn,
                    endColumn,
                    rowNumber,
                    track,
                    shouldDisplayDuration: (endColumn - startColumn) > 2
                });
            }
        });
        
        const numberOfRows = sessionTiles.length > 0 
            ? Math.max(...sessionTiles.map(t => t.rowNumber)) 
            : 1;
        
        return { sessionTiles, numberOfRows, occupiedCells };
    }

    /**
     * Calculate number of rows needed for a track
     */
    calculateNumberOfRowsForTrack(sessions, currentDay) {
        const { numberOfRows } = this.calculateSessionGridPositions(sessions, currentDay);
        return numberOfRows;
    }

    /**
     * Render time header with icons and live indicators
     */
    renderTimeHeader() {
        const timeSlots = this.getVisibleTimeSlots();
        const now = this.state.currentTime || Date.now();
        const uses24Hour = localeUses24HourTime();
        
        return timeSlots.map((time, index) => {
            const nextTime = timeSlots[index + 1];
            const timeDate = new Date(time);
            
            // Check if this slot is currently live
            const isLive = nextTime 
                ? now >= time && now < nextTime 
                : now >= time;
            
            // Show icon at noon/midnight for 24-hour format
            const showIcon = uses24Hour && timeDate.getHours() % 12 === 0 && timeDate.getMinutes() === 0;
            const isDaytime = timeDate.getHours() > 11;
            
            const showSun = showIcon && isDaytime;
            const showMoon = showIcon && !isDaytime;

        return `
                <div class="agenda-block__time-cell ${isLive ? 'time-cell-live' : ''}">
                    ${isLive ? getLiveIndicator() : ''}
                    ${renderDayNightIcon(showSun, showMoon)}
                    <span class="time-value">${formatTime(time)}</span>
            </div>
        `;
        }).join('');
    }

    /**
     * Render main grid with sessions
     */
    renderGrid() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) {
            return `<div class="agenda-block__empty">${this.config.labels.noSessionsText}</div>`;
        }

        const daySessions = this.getSessionsForCurrentDay();
        
        return this.state.tracks.map(track => {
            const trackSessions = daySessions.filter(s => s.sessionTrack.tagId === track.tagId);
            // Each track gets its own grid section for proper separation
        return `
                <div class="agenda-block__track-row">
                    ${this.renderTrackSessions(trackSessions, currentDay)}
            </div>
        `;
        }).join('');
    }

    /**
     * Render sessions for a track with proper grid splitting
     */
    renderTrackSessions(sessions, currentDay) {
        // Get grid positions from shared logic
        const { sessionTiles, numberOfRows, occupiedCells } = this.calculateSessionGridPositions(sessions, currentDay);
        
        // Build HTML
        let html = '';
        
        sessionTiles.forEach(tile => {
            const { session, startColumn, endColumn, rowNumber, track, shouldDisplayDuration } = tile;
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(session.sessionEndTime).getTime();
            
            // Determine duration display format
            const durationText = session.sessionDuration >= 60 
                ? `${Math.floor(session.sessionDuration / 60)} hr ` 
                : `${session.sessionDuration} min`;
            
            // Generate daa-lh attribute like React (for analytics)
            const trackDisplayIndex = (this.state.tracks.findIndex(t => t.tagId === session.sessionTrack.tagId) + 1);
            const daaLh = `Logged Out|No Filter|${session.sessionTrack.title}-${trackDisplayIndex}|${session.isFeatured ? 'Featured' : 'Not Featured'}|${session.sessionId}|${session.isOnDemand ? 'On Demand' : session.isLive ? 'Live' : 'Upcoming'}|${session.sessionTitle}`;
            
            html += `
                <div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn - startColumn}" style="grid-area: ${rowNumber} / ${startColumn} / ${rowNumber + 1} / ${endColumn};">
                    <article class="agenda_tile" daa-lh="${daaLh}" style="border-color: rgb(213, 213, 213);">
                        <a href="${session.cardUrl}" class="title" daa-ll="${session.isOnDemand ? 'On Demand Session Title Click' : 'Session Title Click'}|${session.sessionTitle}">
                            ${session.sessionTitle}
                        </a>
                        <footer>
                            <p class="duration">${durationText}</p>
                        </footer>
                    </article>
            </div>
            `;
        });
        
        // Add empty cells with diagonal pattern for all remaining positions
        // Generate empty cells for each row
        for (let row = 1; row <= numberOfRows; row++) {
            for (let col = 1; col <= VISIBLE_TIME_SLOTS; col++) {
                const cellKey = `${row}-${col}`;
                if (!occupiedCells.has(cellKey)) {
                    html += `
                        <article class="agenda_tile empty" daa-ll="Session title" style="grid-area: ${row} / ${col} / ${row + 1} / ${col + 1}; border-color: rgb(213, 213, 213); background-image: linear-gradient(135deg, rgb(213, 213, 213) 4.5%, rgba(0, 0, 0, 0) 4.5%, rgba(0, 0, 0, 0) 50%, rgb(213, 213, 213) 50%, rgb(213, 213, 213) 54.55%, rgba(0, 0, 0, 0) 54.55%, rgba(0, 0, 0, 0) 100%);"></article>
                    `;
                }
            }
        }
        
        // Render track row with inline grid-template-rows to match React structure
        return `
            <section class="agenda_grid" style="grid-template-rows: repeat(${numberOfRows}, 140px); background-color: rgb(248, 248, 248);">
                ${html}
            </section>
        `;
    }

    /**
     * Render pagination controls
     */
    renderPagination() {
        const maxOffset = this.getMaxTimeOffset();
        return `
            <button 
                class="agenda-block__pagination-btn prev" 
                data-direction="prev"
                ${this.state.timeCursor <= 0 ? 'disabled' : ''}
                aria-label="${this.config.labels.prevAriaLabel || 'Previous'}">
                <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path id="Path_183918" data-name="Path 183918" d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" transform="translate(-5.951 -4.045)" fill="#747474"></path></svg>
            </button>
            <button 
                class="agenda-block__pagination-btn next" 
                data-direction="next"
                ${this.state.timeCursor >= maxOffset ? 'disabled' : ''}
                aria-label="${this.config.labels.nextAriaLabel || 'Next'}">
                <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path id="Path_183691" data-name="Path 183691" d="M16.02,12.294a1.655,1.655,0,0,1-.487,1.173L8.889,20.108A1.665,1.665,0,1,1,6.5,17.8l.041-.041,5.469-5.467L6.539,6.825A1.665,1.665,0,0,1,8.847,4.436l.041.041,6.644,6.642a1.655,1.655,0,0,1,.488,1.174Z" transform="translate(-4 -4.045)" fill="#747474"></path></svg>
            </button>
        `;
    }

    /**
     * Get sessions for current day
     */
    getSessionsForCurrentDay() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return [];

        return this.state.sessions.filter(session => {
            const sessionDayKey = getDayKey(new Date(session.sessionStartTime).getTime());
            return sessionDayKey === currentDay.id;
        });
    }

    /**
     * Get visible time slots
     */
    getVisibleTimeSlots() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return [];

        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const startTime = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);

        const slots = [];
        for (let i = 0; i < VISIBLE_TIME_SLOTS; i++) {
            slots.push(startTime + (i * TIME_SLOT_DURATION * MINUTE_MS));
        }
        return slots;
    }

    /**
     * Get max time offset for pagination
     */
    getMaxTimeOffset() {
        const daySessions = this.getSessionsForCurrentDay();
        if (daySessions.length === 0) return 0;

        const currentDay = this.state.days[this.state.currentDay];
        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const dayEndTime = new Date(currentDay.date + 'T20:00:00Z').getTime();

        const totalSlots = (dayEndTime - dayStartTime) / (TIME_SLOT_DURATION * MINUTE_MS);
        return Math.max(0, totalSlots - VISIBLE_TIME_SLOTS);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Place selector
        this.element.querySelectorAll('.agenda-block__place-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const placeId = e.currentTarget.dataset.placeId;
                this.changePlace(placeId);
            });
        });

        // Day dropdown toggle
        const dropdownToggle = this.element.querySelector('.agenda-block__day-dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Day dropdown items
        this.element.querySelectorAll('.agenda-block__day-dropdown-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dayIndex = parseInt(e.currentTarget.dataset.dayIndex, 10);
                this.changeDay(dayIndex);
                this.state.isDropdownOpen = false;
                this.render();
                this.attachEventListeners();
            });
        });

        // Close dropdown when clicking outside
        if (!this._outsideClickHandler) {
            this._outsideClickHandler = (e) => {
                if (!this.element.contains(e.target) && this.state.isDropdownOpen) {
                    this.state.isDropdownOpen = false;
                    this.render();
                    this.attachEventListeners();
                }
            };
            document.addEventListener('click', this._outsideClickHandler);
        }

        // Pagination
        this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.currentTarget.dataset.direction;
                this.paginate(direction);
            });
        });

        // Window resize
        const resizeHandler = debounce(() => {
            const wasMobile = this.state.isMobile;
            this.state.isMobile = window.innerWidth < 768;
            if (wasMobile !== this.state.isMobile) {
                this.render();
                this.attachEventListeners();
            }
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
    }

    /**
     * Toggle dropdown
     */
    toggleDropdown() {
        this.state.isDropdownOpen = !this.state.isDropdownOpen;
        this.render();
        this.attachEventListeners();
    }

    /**
     * Change current place
     */
    changePlace(placeId) {
        this.state.currentPlace = placeId;
        // In a real implementation, you would convert times based on timezone here
        this.render();
        this.attachEventListeners();
    }

    /**
     * Change current day
     */
    changeDay(dayIndex) {
        if (dayIndex >= 0 && dayIndex < this.state.days.length) {
            this.state.currentDay = dayIndex;
            this.state.timeCursor = 0; // Reset time position
            this.render();
            this.attachEventListeners();
        }
    }

    /**
     * Paginate time slots
     */
    paginate(direction) {
        const step = VISIBLE_TIME_SLOTS; // Move by visible slots
        const maxOffset = this.getMaxTimeOffset();

        if (direction === 'next' && this.state.timeCursor < maxOffset) {
            this.state.timeCursor = Math.min(this.state.timeCursor + step, maxOffset);
        } else if (direction === 'prev' && this.state.timeCursor > 0) {
            this.state.timeCursor = Math.max(this.state.timeCursor - step, 0);
        }

        this.render();
        this.attachEventListeners();
    }

    /**
     * Setup sticky header using IntersectionObserver
     */
    setupStickyHeader() {
        const header = this.element.querySelector('.agenda-block__header');
        if (!header) return;

        const globalNavHeight = this.getSubNavHeight();

        // Set CSS variable for sticky top position
        header.style.setProperty('top', `${globalNavHeight - 1}px`);
        console.log('globalNavHeight', globalNavHeight);
        // Use IntersectionObserver to detect when header scrolls out of view
        const observer = new IntersectionObserver(([entry]) => {
            entry.target.classList.toggle('agenda-block__header--pinned', entry.intersectionRatio < 1);
        }, {
            threshold: [1],
            rootMargin: `-${globalNavHeight}px 0px 0px 0px`
        });

        observer.observe(header);
    }

    /**
     * Get height of sub-navigation (sticky header + secondary nav)
     */
    getSubNavHeight() {
        let top = 0;
        
        const stickyHeader = document.querySelector('.global-navigation');
        // const subNav = document.getElementById('AdobeSecondaryNav');
        
        // if (subNav) {
        //     top += subNav.offsetHeight;
        // }
        
        if (stickyHeader && !stickyHeader.classList.contains('feds-header-wrapper--retracted')) {
            top += stickyHeader.offsetHeight;
        }
        
        return top;
    }

    /**
     * Start live updates interval
     */
    startLiveUpdates() {
        // Update current time every 5 seconds
        this.updateInterval = setInterval(() => {
            this.state.currentTime = Date.now();
            
            // Update session live/on-demand status
            this.state.sessions = this.state.sessions.map(session => ({
                ...session,
                isLive: isSessionLive(session),
                isOnDemand: isSessionOnDemand(session)
            }));
            
            // Re-render only the time cells to avoid replacing dropdown
            const timeCells = Array.from(this.element.querySelectorAll('.agenda-block__time-cell'));
            timeCells.forEach((cell) => {
                cell.parentNode.removeChild(cell);
            });
            
            const timeHeader = this.element.querySelector('.agenda-block__time-header');
            if (timeHeader) {
                timeHeader.insertAdjacentHTML('beforeend', this.renderTimeHeader());
            }
        }, 5000); // Update every 5 seconds
    }
    
    /**
     * Clean up intervals
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// ============================================================================
// INIT FUNCTION FOR BLOCK LOADER
// ============================================================================

export default function init(el) {
    return new VanillaAgendaBlock(el);
}

