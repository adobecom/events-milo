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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/opening-keynote-gs1.html",
            "id": "2f6ed4b5-4c5c-3c49-aee9-59df2354d7fa",
            "sortDate": "2024-10-14T13:00:00.000Z",
            "sessionTitle": "Opening Keynote",
            "sessionCode": "GS1",
            "sessionDuration": "120",
            "sessionEndTime": "2024-10-14T15:00:00.000Z",
            "sessionId": "1718042795915001dAYR",
            "sessionStartTime": "2024-10-14T13:00:00.000Z",
            "sessionTimeId": "1718043036263001A7Zk",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/opening-keynote-asl-gs1-1.html",
            "id": "be0b0e8f-8b34-35d8-9cfa-d9cf6124fcf2",
            "sortDate": "2024-10-14T13:00:00.000Z",
            "sessionTitle": "Opening Keynote - ASL",
            "sessionCode": "GS1-1",
            "sessionDuration": "120",
            "sessionEndTime": "2024-10-14T15:00:00.000Z",
            "sessionId": "1720542172266001SnpR",
            "sessionStartTime": "2024-10-14T13:00:00.000Z",
            "sessionTimeId": "1726766677028001XKMQ",
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/streamlining-social-media-asset-creation-os802.html",
            "id": "6e13a75c-8bdf-3acd-ba9f-e59aa80d8db5",
            "sortDate": "2024-10-14T15:30:00.000Z",
            "sessionTitle": "Streamlining Social Media Asset Creation with Adobe Express",
            "sessionCode": "OS802",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T16:00:00.000Z",
            "sessionId": "1718231460232001SXR9",
            "sessionStartTime": "2024-10-14T15:30:00.000Z",
            "sessionTimeId": "1722017073832001puFr",
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
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/from-inspiration-to-illustration-believing-in-os800.html",
            "id": "4c23e7e8-b56c-301e-abb9-2e57c286797c",
            "sortDate": "2024-10-14T15:30:00.000Z",
            "sessionTitle": "From Inspiration to Illustration: Believing in the Power of Beauty",
            "sessionCode": "OS800",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T16:00:00.000Z",
            "sessionId": "1718231460135001SBX7",
            "sessionStartTime": "2024-10-14T15:30:00.000Z",
            "sessionTimeId": "1722016956202001RNVd",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-community-keynote-recap-what-updates-mean-for-a-al680.html",
            "id": "a6a0fab9-cf9f-3837-9797-b566c6ba9733",
            "sortDate": "2024-10-14T15:30:00.000Z",
            "sessionTitle": "Community Keynote Recap: What Updates Mean for Artists",
            "sessionCode": "AL680",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-14T16:15:00.000Z",
            "sessionId": "1724348402077001fb1M",
            "sessionStartTime": "2024-10-14T15:30:00.000Z",
            "sessionTimeId": "1724451028802001IOVC",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
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
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
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
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
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
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/tips-and-tricks-to-increase-a-photographs-impact-os422.html",
            "id": "d1550f7e-f192-3925-acda-e5276cc60ddd",
            "sortDate": "2024-10-14T16:00:00.000Z",
            "sessionTitle": "Tips and Tricks to Increase a Photograph’s Impact",
            "sessionCode": "OS422",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T16:30:00.000Z",
            "sessionId": "1720731250790001EcZG",
            "sessionStartTime": "2024-10-14T16:00:00.000Z",
            "sessionTimeId": "1720824103829001gJQC",
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/nextlevel-techniques-in-photoshop-os321.html",
            "id": "6afa1367-eedf-3bc8-804e-356009a58d97",
            "sortDate": "2024-10-14T16:00:00.000Z",
            "sessionTitle": "Next-Level Techniques in Photoshop",
            "sessionCode": "OS321",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T16:30:00.000Z",
            "sessionId": "1717613652341001ZJFP",
            "sessionStartTime": "2024-10-14T16:00:00.000Z",
            "sessionTimeId": "1721064360143001HLS5",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/typographic-awareness-how-fonts-impact-meaning-os671.html",
            "id": "0ec2a8f6-23d9-3cd3-9218-a5e1f57d5f92",
            "sortDate": "2024-10-14T16:00:00.000Z",
            "sessionTitle": "Typographic Awareness: How Fonts Impact Meaning",
            "sessionCode": "OS671",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T16:30:00.000Z",
            "sessionId": "1718285089600001RdOs",
            "sessionStartTime": "2024-10-14T16:00:00.000Z",
            "sessionTimeId": "1720469631916001zK64",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/social-media-content-creation-in-the-world-of-ai-os632.html",
            "id": "70973480-472e-34a5-8459-cab81eab69a0",
            "sortDate": "2024-10-14T16:00:00.000Z",
            "sessionTitle": "Social Media Content Creation in the World of AI",
            "sessionCode": "OS632",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T16:30:00.000Z",
            "sessionId": "1718136367925001RR0O",
            "sessionStartTime": "2024-10-14T16:00:00.000Z",
            "sessionTimeId": "1718285515356001utLd",
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
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
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
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-first-take-photoshop-updates-with-tony-harmer-al681.html",
            "id": "208a51b0-9d67-3746-a27a-2968808b321d",
            "sortDate": "2024-10-14T16:15:00.000Z",
            "sessionTitle": "First Take: Photoshop Updates with Tony Harmer",
            "sessionCode": "AL681",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-14T17:00:00.000Z",
            "sessionId": "1724349464274001PIhf",
            "sessionStartTime": "2024-10-14T16:15:00.000Z",
            "sessionTimeId": "1724451237931001C5UZ",
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/art-culture-community-student-journey-os202.html",
            "id": "2a8fce16-e060-3d5d-850b-c32310079a85",
            "sortDate": "2024-10-14T16:30:00.000Z",
            "sessionTitle": "Art, Culture, Community: Student Journey with Adobe Express",
            "sessionCode": "OS202",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T17:00:00.000Z",
            "sessionId": "1714406532066001z10a",
            "sessionStartTime": "2024-10-14T16:30:00.000Z",
            "sessionTimeId": "1718284979176001Zri6",
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
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/elevating-storytelling-stylistic-consistency-os804.html",
            "id": "20a57623-6231-3dbb-901f-65118d96b564",
            "sortDate": "2024-10-14T16:30:00.000Z",
            "sessionTitle": "Elevating Storytelling: Stylistic Consistency in Photography",
            "sessionCode": "OS804",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T17:00:00.000Z",
            "sessionId": "1718231460315001S49D",
            "sessionStartTime": "2024-10-14T16:30:00.000Z",
            "sessionTimeId": "1722860885530001vQoU",
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
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/optimize-lightroom-workflow-with-sandisk-storage-os707.html",
            "id": "ac4b41b5-6805-3734-9be7-decc90e2bdd4",
            "sortDate": "2024-10-14T16:30:00.000Z",
            "sessionTitle": "Optimize Lightroom Workflow with SanDisk Storage Solutions",
            "sessionCode": "OS707",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T17:00:00.000Z",
            "sessionId": "1716323410797001E8GC",
            "sessionStartTime": "2024-10-14T16:30:00.000Z",
            "sessionTimeId": "1723047773940001ACGm",
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
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/building-brands-from-brand-strategy-to-social-os512.html",
            "id": "485f4ec0-fd64-307c-a559-401fe8be95a1",
            "sortDate": "2024-10-14T16:30:00.000Z",
            "sessionTitle": "Building Brands: From Brand Strategy to Social Content",
            "sessionCode": "OS512",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-14T17:15:00.000Z",
            "sessionId": "1714600011893001esZ5",
            "sessionStartTime": "2024-10-14T16:30:00.000Z",
            "sessionTimeId": "1718059447630001dN4z",
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
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-finding-character-inspiration-in-everyday-obj-os300.html",
            "id": "586fa6e1-11b9-3b9a-b887-05c60a1517a7",
            "sortDate": "2024-10-14T16:30:00.000Z",
            "sessionTitle": "Finding Character Inspiration in Everyday Objects",
            "sessionCode": "OS300",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T17:00:00.000Z",
            "sessionId": "1716331469258001NdPi",
            "sessionStartTime": "2024-10-14T16:30:00.000Z",
            "sessionTimeId": "1718059405241001SiNk",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/making-a-mark-from-analog-to-digital-and-back-os801.html",
            "id": "e2814181-af9c-3275-b807-b134fcddd581",
            "sortDate": "2024-10-14T16:30:00.000Z",
            "sessionTitle": "Making a Mark: From Analog to Digital and Back Again",
            "sessionCode": "OS801",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T17:00:00.000Z",
            "sessionId": "1718231460186001SCxH",
            "sessionStartTime": "2024-10-14T16:30:00.000Z",
            "sessionTimeId": "1721927216882001RmeP",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-brittney-megann-al686.html",
            "id": "309b9600-67c1-3c59-b66b-781b410c0996",
            "sortDate": "2024-10-14T17:00:00.000Z",
            "sessionTitle": "Meet the Speaker: Brittney Megann",
            "sessionCode": "AL686",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T17:30:00.000Z",
            "sessionId": "1724351057143001Pd7K",
            "sessionStartTime": "2024-10-14T17:00:00.000Z",
            "sessionTimeId": "1724453618266001Iafs",
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max/category/running-your-business",
                    "title": "Running Your Business"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/css-motion-design-for-graphic-designers-ss2.html",
            "id": "449b5f22-2376-3c94-a854-da69d0744e16",
            "sortDate": "2024-10-14T17:00:00.000Z",
            "sessionTitle": "Creativity Super Session: Motion Design for Graphic Designers",
            "sessionCode": "SS2",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-14T18:00:00.000Z",
            "sessionId": "1709835444663001DgmI",
            "sessionStartTime": "2024-10-14T17:00:00.000Z",
            "sessionTimeId": "1717631470125001H0Ko",
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
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/creative-super-session",
                    "title": "Creativity Super Session"
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
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/a-manifesto-for-collaboration-s6002.html",
            "id": "172e73fd-1dd9-30cd-870b-e23bcc2ee543",
            "sortDate": "2024-10-14T17:00:00.000Z",
            "sessionTitle": "A Manifesto for Collaboration",
            "sessionCode": "S6002",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-14T18:00:00.000Z",
            "sessionId": "1709835444284001D4C8",
            "sessionStartTime": "2024-10-14T17:00:00.000Z",
            "sessionTimeId": "1717632504708001bOuM",
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-meet-the-speaker-anna-mcnaught-al683.html",
            "id": "7d0a9b2e-a462-319b-b287-2b458578354e",
            "sortDate": "2024-10-14T17:30:00.000Z",
            "sessionTitle": "Meet the Speaker: Anna McNaught",
            "sessionCode": "AL683",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T18:00:00.000Z",
            "sessionId": "1724350507022001oI2X",
            "sessionStartTime": "2024-10-14T17:30:00.000Z",
            "sessionTimeId": "1724451331754001CuQZ",
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
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/wicked-creativity-unlocked-adobe-firefly-tricks-an-os711.html",
            "id": "db8e9ffe-60c7-3f72-b92b-6f4737cbd084",
            "sortDate": "2024-10-14T18:00:00.000Z",
            "sessionTitle": "Wicked Creativity Unlocked: Adobe Firefly Tricks and Treats",
            "sessionCode": "OS711",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T18:30:00.000Z",
            "sessionId": "1721759417335001RsXW",
            "sessionStartTime": "2024-10-14T18:00:00.000Z",
            "sessionTimeId": "1725891647380001VUEy",
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
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/creativity-unleashed-your-favorite-adobe-apps-os700.html",
            "id": "2fb0a996-a942-3cca-96c6-64a6c2380169",
            "sortDate": "2024-10-14T18:00:00.000Z",
            "sessionTitle": "Creativity Unleashed: Your Favorite Adobe Apps Simplified",
            "sessionCode": "OS700",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T18:30:00.000Z",
            "sessionId": "1714748633391001qaOo",
            "sessionStartTime": "2024-10-14T18:00:00.000Z",
            "sessionTimeId": "1718903297562001vxuj",
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
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
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
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/upskilling-for-todays-job-market-with-digital-os201.html",
            "id": "3628923d-ab7c-307c-8881-85f452cc1a6d",
            "sortDate": "2024-10-14T18:00:00.000Z",
            "sessionTitle": "Upskilling for Today’s Job Market with Digital Credentials",
            "sessionCode": "OS201",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T18:30:00.000Z",
            "sessionId": "1714599143059001xdGi",
            "sessionStartTime": "2024-10-14T18:00:00.000Z",
            "sessionTimeId": "1718284939006001ZE8M",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/building-onbrand-teams-with-adobe-express-os510.html",
            "id": "6896bf8d-eb8d-3375-9736-2bd7bc3e93cb",
            "sortDate": "2024-10-14T18:00:00.000Z",
            "sessionTitle": "Building On-brand Teams with Adobe Express",
            "sessionCode": "OS510",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T18:30:00.000Z",
            "sessionId": "1714667374653001rpdl",
            "sessionStartTime": "2024-10-14T18:00:00.000Z",
            "sessionTimeId": "1725409416433001lkQS",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-tiffany-nguyen-al684.html",
            "id": "9b5b6e9a-6803-3903-b7c5-51b3dc9d4c1b",
            "sortDate": "2024-10-14T18:00:00.000Z",
            "sessionTitle": "Meet the Speaker: Tiffany Nguyen",
            "sessionCode": "AL684",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T18:30:00.000Z",
            "sessionId": "1724350684743001YVZH",
            "sessionStartTime": "2024-10-14T18:00:00.000Z",
            "sessionTimeId": "1724451372026001pVge",
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/color-materials-and-finish-design-os101.html",
            "id": "641c58c9-692a-3e56-86f2-1589d36f11ba",
            "sortDate": "2024-10-14T18:30:00.000Z",
            "sessionTitle": "Color, Materials, and Finish Design with Substance 3D",
            "sessionCode": "OS101",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T19:00:00.000Z",
            "sessionId": "1714512832227001uE3M",
            "sessionStartTime": "2024-10-14T18:30:00.000Z",
            "sessionTimeId": "1718059736947001w6Uz",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d",
                "title": "3D"
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
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/getting-the-most-out-of-creative-cloud-os701.html",
            "id": "cfe81f30-9e04-36f4-a890-b86fb1da961b",
            "sortDate": "2024-10-14T18:30:00.000Z",
            "sessionTitle": "Getting the Most Out of Creative Cloud",
            "sessionCode": "OS701",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T19:00:00.000Z",
            "sessionId": "1714749887114001GVcR",
            "sessionStartTime": "2024-10-14T18:30:00.000Z",
            "sessionTimeId": "1719251596178001uzvd",
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
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-top-plays-10-adobe-fresco-toolsfeatures-os330.html",
            "id": "3d015ad3-275b-3733-970e-d0739a9f766f",
            "sortDate": "2024-10-14T18:30:00.000Z",
            "sessionTitle": "Top Plays: 10 Adobe Fresco Tools/Features You Need to Use Now!",
            "sessionCode": "OS330",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T19:00:00.000Z",
            "sessionId": "1716397701008001EUSn",
            "sessionStartTime": "2024-10-14T18:30:00.000Z",
            "sessionTimeId": "1718285777040001hlXZ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-adobe-express-updates-with-lucas-okeefe-al685.html",
            "id": "5cabfb67-190c-3663-b741-e7b89830cabe",
            "sortDate": "2024-10-14T18:30:00.000Z",
            "sessionTitle": "First Take: Adobe Express Updates with Lucas O’Keefe",
            "sessionCode": "AL685",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-14T19:15:00.000Z",
            "sessionId": "1724350842304001wPn6",
            "sessionStartTime": "2024-10-14T18:30:00.000Z",
            "sessionTimeId": "1724451697152001yZ4g",
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/animated-characters-for-social-media-character-os633.html",
            "id": "90012bd7-da1c-3da9-8860-6d0af9e91aed",
            "sortDate": "2024-10-14T18:30:00.000Z",
            "sessionTitle": "Animated Characters for Social Media: Character Animator",
            "sessionCode": "OS633",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T19:00:00.000Z",
            "sessionId": "1715635483190001EFVM",
            "sessionStartTime": "2024-10-14T18:30:00.000Z",
            "sessionTimeId": "1718059646817001w89n",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-meg-lewis-al682.html",
            "id": "e3067767-5446-3bb4-9c48-0c15f5c5fdf0",
            "sortDate": "2024-10-14T19:15:00.000Z",
            "sessionTitle": "Meet the Speaker: Meg Lewis",
            "sessionCode": "AL682",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T19:45:00.000Z",
            "sessionId": "1724350371243001PFl7",
            "sessionStartTime": "2024-10-14T19:15:00.000Z",
            "sessionTimeId": "1724694182873001PIx4",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/aaron-draplin-old-dog-new-tricks-s6005.html",
            "id": "55944839-1bb5-3227-9666-b1d2a8112c63",
            "sortDate": "2024-10-14T19:15:00.000Z",
            "sessionTitle": "Aaron Draplin: Old Dog, New Tricks",
            "sessionCode": "S6005",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-14T20:15:00.000Z",
            "sessionId": "1709835444534001DfSO",
            "sessionStartTime": "2024-10-14T19:15:00.000Z",
            "sessionTimeId": "1717804833312001uxq7",
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
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/unseen-to-unforgettable-the-power-of-personal-s6003.html",
            "id": "0c320644-a69d-3894-9714-33b1bc9a7e17",
            "sortDate": "2024-10-14T19:15:00.000Z",
            "sessionTitle": "Unseen to Unforgettable: The Power of Personal Branding",
            "sessionCode": "S6003",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-14T20:15:00.000Z",
            "sessionId": "1709835444340001D6yN",
            "sessionStartTime": "2024-10-14T19:15:00.000Z",
            "sessionTimeId": "1717634516814001PVAs",
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
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-nicte-cuevas-al687.html",
            "id": "c9ee1e19-7a93-34e4-8ee5-38e6fae46fc7",
            "sortDate": "2024-10-14T19:45:00.000Z",
            "sessionTitle": "Meet the Speaker: Nicte Cuevas",
            "sessionCode": "AL687",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T20:15:00.000Z",
            "sessionId": "1724351220105001wFxy",
            "sessionStartTime": "2024-10-14T19:45:00.000Z",
            "sessionTimeId": "1724453753249001yvXh",
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
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-level-up-your-editing-process-with-ai-tools-os420.html",
            "id": "74de5185-8ab4-3c4d-8494-70baa293a66b",
            "sortDate": "2024-10-14T20:00:00.000Z",
            "sessionTitle": "Level Up Your Editing Process with AI Tools in Lightroom",
            "sessionCode": "OS420",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T20:30:00.000Z",
            "sessionId": "1717520525078001dZI3",
            "sessionStartTime": "2024-10-14T20:00:00.000Z",
            "sessionTimeId": "1718060052323001w8IO",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/optimizing-social-content-ab-strategies-os514.html",
            "id": "c45d3a52-4955-3755-aaa4-30b54b387722",
            "sortDate": "2024-10-14T20:00:00.000Z",
            "sessionTitle": "Optimizing Social Content: A/B Strategies for Success",
            "sessionCode": "OS514",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T20:30:00.000Z",
            "sessionId": "1713813543384001MNSU",
            "sessionStartTime": "2024-10-14T20:00:00.000Z",
            "sessionTimeId": "1718060095583001wDJb",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/aipowered-creativity-a-new-era-with-microsoft-surf-os708.html",
            "id": "71a52157-c8fd-30d7-b3b8-558bdc62bc90",
            "sortDate": "2024-10-14T20:00:00.000Z",
            "sessionTitle": "AI-Powered Creativity: A New Era with Microsoft Surface",
            "sessionCode": "OS708",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T20:30:00.000Z",
            "sessionId": "1716323410899001Eg37",
            "sessionStartTime": "2024-10-14T20:00:00.000Z",
            "sessionTimeId": "1725997374757001nMmI",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/products/photoshop-express",
                    "title": "Photoshop Express"
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
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
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
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/quickly-scale-your-marketing-campaigns-with-ai-os705.html",
            "id": "171d393b-5d5f-3740-b976-70c75fbcdd73",
            "sortDate": "2024-10-14T20:00:00.000Z",
            "sessionTitle": "Quickly Scale Your Marketing Campaigns with AI Voice",
            "sessionCode": "OS705",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T20:30:00.000Z",
            "sessionId": "1716323410390001EELK",
            "sessionStartTime": "2024-10-14T20:00:00.000Z",
            "sessionTimeId": "1723047545239001YdTq",
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
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
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
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-michael-fugoso-al690.html",
            "id": "71de8a1b-02c0-317f-862b-2b8ccd55da84",
            "sortDate": "2024-10-14T20:15:00.000Z",
            "sessionTitle": "Meet the Speaker: Michael Fugoso",
            "sessionCode": "AL690",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-14T21:00:00.000Z",
            "sessionId": "1724354219233001GR1I",
            "sessionStartTime": "2024-10-14T20:15:00.000Z",
            "sessionTimeId": "1724693866475001Qjtc",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-putting-my-design-cards-on-the-table-os302.html",
            "id": "7b0d988f-7c80-35ca-91bf-fb38cbced1f4",
            "sortDate": "2024-10-14T20:30:00.000Z",
            "sessionTitle": "Putting My (Design) Cards on the Table",
            "sessionCode": "OS302",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T21:00:00.000Z",
            "sessionId": "1717006433973001jMeY",
            "sessionStartTime": "2024-10-14T20:30:00.000Z",
            "sessionTimeId": "1718285730782001bOVF",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-techniques-to-maximize-automation-and-ai-tools-os311.html",
            "id": "246e4802-6e33-32d6-b554-fcc00835cd75",
            "sortDate": "2024-10-14T20:30:00.000Z",
            "sessionTitle": "Techniques to Maximize Automation and AI Tools in InDesign",
            "sessionCode": "OS311",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-14T21:00:00.000Z",
            "sessionId": "1718041014118001w70O",
            "sessionStartTime": "2024-10-14T20:30:00.000Z",
            "sessionTimeId": "1718060180266001wAFz",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/css-humancentered-ai-strategies-ss4.html",
            "id": "38e1a05e-8247-3fef-9f70-974eabad19fa",
            "sortDate": "2024-10-14T21:15:00.000Z",
            "sessionTitle": "Creativity Super Session: Human-Centered AI Strategies for Creative Leaders",
            "sessionCode": "SS4",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-14T22:15:00.000Z",
            "sessionId": "1709835444784001D7Ay",
            "sessionStartTime": "2024-10-14T21:15:00.000Z",
            "sessionTimeId": "1717710683462001QRYo",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/creative-super-session",
                    "title": "Creativity Super Session"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/40-years-of-art-and-design-graffiti-hiphop-and-s6001.html",
            "id": "7687309d-df5f-3f3d-8c85-4c661c726928",
            "sortDate": "2024-10-14T21:15:00.000Z",
            "sessionTitle": "40 Years of Art and Design: Graffiti, Hip-Hop, and Fine Art",
            "sessionCode": "S6001",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-14T22:15:00.000Z",
            "sessionId": "1709835444233001D7di",
            "sessionStartTime": "2024-10-14T21:15:00.000Z",
            "sessionTimeId": "1717632073814001lLUF",
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
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
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
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/asia-pacific-opening-keynote-gs6.html",
            "id": "4b1cb65e-c4af-376c-b210-c492f4145e45",
            "sortDate": "2024-10-15T03:00:00.000Z",
            "sessionTitle": "Asia Pacific Opening Keynote",
            "sessionCode": "GS6",
            "sessionDuration": "120",
            "sessionEndTime": "2024-10-15T05:00:00.000Z",
            "sessionId": "1721259048119001jtTE",
            "sessionStartTime": "2024-10-15T03:00:00.000Z",
            "sessionTimeId": "1721259192188001Ih34",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/3d-texturing-made-simple-with-substance-3d-os826.html",
            "id": "3c962470-bcb5-31ad-b41a-4fd697dfac4e",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "3D Texturing Made Simple with Substance 3D",
            "sessionCode": "OS826",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1718231460752001Sk6x",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1722507326492001RuZ4",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d",
                "title": "3D"
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
                    "tagId": "caas:events/products/substance-3d-sampler",
                    "title": "Substance 3D Sampler"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d",
                    "title": "3D"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/products/substance-3d-assets",
                    "title": "Substance 3D Assets"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/mastering-masking-enhancing-photos-in-lightroom-os824.html",
            "id": "3ecb2f53-f60c-36f0-83bb-733ebb86419b",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "Mastering Masking: Enhancing Photos in Lightroom",
            "sessionCode": "OS824",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1718231460664001SQtn",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1722507055209001vNFj",
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
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/lightroom-on-mobile",
                    "title": "Lightroom on mobile"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/making-animated-artwork-with-firefly-and-adobe-ex-os823.html",
            "id": "743bf0ab-824d-3326-a5ed-c565509ef5a3",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "Making Animated Artwork with Firefly and Adobe Express",
            "sessionCode": "OS823",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1718231460623001SEBj",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1722506749981001vtzq",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/future-photoshop-tricks-you-need-to-know-in-adv-os820.html",
            "id": "d2c2f8fe-6f2d-3bcf-b393-dabfd5d1045a",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "Future Photoshop Tricks You Need to Know in Advance",
            "sessionCode": "OS820",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1718231460494001SHQx",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1722507879912001JPUN",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/quick-hack-animate-illustrations-for-quick-os822.html",
            "id": "e6874f3f-fe10-35db-b46a-af11b6befec2",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "Quick Hack: Animate Illustrations for Quick Content Creation",
            "sessionCode": "OS822",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1718231460581001SHlX",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1722507582348001R1aj",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-meet-the-speaker-anna-mcnaught-al683.html",
            "id": "ab05d8ec-ecd0-3d4a-94ee-64e38a3c52cd",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "Meet the Speaker: Anna McNaught",
            "sessionCode": "AL683",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1724350507022001oI2X",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1725555169867001Yszc",
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
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-moving-your-brand-into-video-os631.html",
            "id": "9ed4d52b-33dd-362a-9a4e-9f6ff898833b",
            "sortDate": "2024-10-15T05:30:00.000Z",
            "sessionTitle": "Moving Your Brand into Video",
            "sessionCode": "OS631",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:00:00.000Z",
            "sessionId": "1718136158575001dCOi",
            "sessionStartTime": "2024-10-15T05:30:00.000Z",
            "sessionTimeId": "1720722459393001HBDP",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-integrate-3d-with-photoshop-os100.html",
            "id": "983de94b-7a6f-3979-8ce3-89791a4e74bd",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "Integrate 3D with Photoshop Using the Substance 3D Viewer Beta App",
            "sessionCode": "OS100",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1715622246336001zFeR",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1720728752814001bEJP",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/education",
                "title": "Education"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/3d",
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
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/from-ideas-to-brands-launching-your-small-bus-os821.html",
            "id": "03819405-5713-3f7e-a2c1-bfda29873982",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "From Ideas to Brands: Launching Your Small Business Online",
            "sessionCode": "OS821",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1718231460538001S5sR",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1722589581608001PapC",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-finding-character-inspiration-in-everyday-obj-os300.html",
            "id": "180ac1f5-158d-3386-a592-3ab89706f8b8",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "Finding Character Inspiration in Everyday Objects",
            "sessionCode": "OS300",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1716331469258001NdPi",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1720728703670001gjKc",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/master-of-none-the-art-of-experimentation-os825.html",
            "id": "c9acd498-ed6d-388c-874e-a10201f1d938",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "Master of None: The Art of Experimentation",
            "sessionCode": "OS825",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1718231460709001S2PI",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1722507165739001zBEC",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-turning-your-art-doodles-and-lettering-os301.html",
            "id": "3bfc30a9-e327-3870-9e8d-12f4337f4288",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "Turning Your Art Doodles and Lettering into Fun Patterns",
            "sessionCode": "OS301",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1716331755567001HrI3",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1720729315864001rWlf",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/how-to-make-creative-shortform-video-for-social-os827.html",
            "id": "7a05a71b-2c29-38c5-8276-b01fdaa9088c",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "How to Make Creative Short-Form Video for Social Media",
            "sessionCode": "OS827",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1718231460800001St3k",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1722507426210001OZI1",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-enhancing-your-work-through-cinematic-color-os805.html",
            "id": "bddb4292-60b5-3ddf-9c08-18ed5e35c25a",
            "sortDate": "2024-10-15T06:00:00.000Z",
            "sessionTitle": "Enhancing Your Work Through Cinematic Color Grading",
            "sessionCode": "OS805",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T06:30:00.000Z",
            "sessionId": "1718231460361001SotF",
            "sessionStartTime": "2024-10-15T06:00:00.000Z",
            "sessionTimeId": "1724866773424001WnZr",
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
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-aipowered-innovation-leaping-ahead-os110.html",
            "id": "aa010d5d-04f5-3ba3-b29b-564491238780",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "AI-Powered Innovation: Leaping Ahead and Staying There",
            "sessionCode": "OS110",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1721747444274001mNh3",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1721928765337001eYA8",
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
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-level-up-your-editing-process-with-ai-tools-os420.html",
            "id": "b5a812bb-b13c-31b4-91e6-b10200ad6131",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "Level Up Your Editing Process with AI Tools in Lightroom",
            "sessionCode": "OS420",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1717520525078001dZI3",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1720729559142001qKdf",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-techniques-to-maximize-automation-and-ai-os311.html",
            "id": "bd3c8f86-c5cc-3384-94db-68a67cd76613",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "Techniques to Maximize Automation and AI Tools in InDesign",
            "sessionCode": "OS311",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1718041014118001w70O",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1720729438796001frnr",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-new-and-incredible-innovations-in-photoshop-os322.html",
            "id": "312ea238-cd27-3ddc-ae2c-a1625ea37beb",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "New and Incredible Innovations in Photoshop",
            "sessionCode": "OS322",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1719604963124001vh8j",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1724803614307001kAfM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-putting-my-design-cards-on-the-table-os302.html",
            "id": "50dc8162-c05c-39b5-9252-d545c1d8ed41",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "Putting My (Design) Cards on the Table",
            "sessionCode": "OS302",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1717006433973001jMeY",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1720805755956001V8y7",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-top-plays-10-adobe-fresco-toolsfeatures-os330.html",
            "id": "157fa0e3-49e2-34ab-a791-674af6ec78f8",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "Top Plays: 10 Adobe Fresco Tools/Features You Need to Use Now!",
            "sessionCode": "OS330",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1716397701008001EUSn",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1721928653514001yqxe",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-first-take-photoshop-updates-with-tony-harmer-al681.html",
            "id": "d21cfa42-f823-325a-8bb6-e1070f8439d7",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "First Take: Photoshop Updates with Tony Harmer",
            "sessionCode": "AL681",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-15T07:15:00.000Z",
            "sessionId": "1724349464274001PIhf",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1725555206339001bgnx",
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-after-effects-101-after-effects-for-new-user-os630.html",
            "id": "797578cf-2762-3ed4-b8d5-6554a1b4ee5a",
            "sortDate": "2024-10-15T06:30:00.000Z",
            "sessionTitle": "After Effects 101: After Effects for New Users",
            "sessionCode": "OS630",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T07:00:00.000Z",
            "sessionId": "1713997983387001Y22V",
            "sessionStartTime": "2024-10-15T06:30:00.000Z",
            "sessionTimeId": "1720729692030001f7VW",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-whats-new-in-photoshop-al694.html",
            "id": "017109df-13d5-3cfb-9f9c-7623009f2e61",
            "sortDate": "2024-10-15T10:00:00.000Z",
            "sessionTitle": "First Take: What’s New in Photoshop",
            "sessionCode": "AL694",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T11:00:00.000Z",
            "sessionId": "1724354820413001GNY1",
            "sessionStartTime": "2024-10-15T10:00:00.000Z",
            "sessionTimeId": "1724694894005001xpku",
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
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
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
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/using-adobe-express-in-creative-workflows-al695.html",
            "id": "725b0615-1f1d-30e4-932c-dc39ed84ae29",
            "sortDate": "2024-10-15T11:00:00.000Z",
            "sessionTitle": "Using Adobe Express in Creative Workflows",
            "sessionCode": "AL695",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T12:00:00.000Z",
            "sessionId": "1724354985801001rrHk",
            "sessionStartTime": "2024-10-15T11:00:00.000Z",
            "sessionTimeId": "1724694964831001QNmS",
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
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/movies-myth-metaphor-art-of-film-and-tv-title-s6000.html",
            "id": "f468ba6b-5922-3be1-bdb1-4e9f16a09bcc",
            "sortDate": "2024-10-15T12:00:00.000Z",
            "sessionTitle": "Movies, Myth, Metaphor: Art of Film and TV Title Sequences",
            "sessionCode": "S6000",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T13:00:00.000Z",
            "sessionId": "1709835444177001DUZ8",
            "sessionStartTime": "2024-10-15T12:00:00.000Z",
            "sessionTimeId": "1717632974265001bIxM",
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/ideas-to-images-a-creative-journey-s6004.html",
            "id": "f3750bc1-d841-3d6f-827c-6655f3a55fff",
            "sortDate": "2024-10-15T12:00:00.000Z",
            "sessionTitle": "Ideas to Images: A Creative Journey",
            "sessionCode": "S6004",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T13:00:00.000Z",
            "sessionId": "1709835444472001DBZX",
            "sessionStartTime": "2024-10-15T12:00:00.000Z",
            "sessionTimeId": "1717707855634001P4Y2",
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
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
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
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
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
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/max-day-1-recap-al697.html",
            "id": "73a46322-5032-3496-a535-e54ac2b31d80",
            "sortDate": "2024-10-15T13:00:00.000Z",
            "sessionTitle": "MAX Day 1 Recap",
            "sessionCode": "AL697",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T14:00:00.000Z",
            "sessionId": "1724355234341001WT4Y",
            "sessionStartTime": "2024-10-15T13:00:00.000Z",
            "sessionTimeId": "1724695067798001vCAX",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/inspiration-keynote-asl-gs2-1.html",
            "id": "7c96f11e-d428-302c-bd6d-974479a15ac1",
            "sortDate": "2024-10-15T14:00:00.000Z",
            "sessionTitle": "Inspiration Keynote - ASL",
            "sessionCode": "GS2-1",
            "sessionDuration": "90",
            "sessionEndTime": "2024-10-15T15:30:00.000Z",
            "sessionId": "1720542270976001f4cB",
            "sessionStartTime": "2024-10-15T14:00:00.000Z",
            "sessionTimeId": "1726766817351001IHue",
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/inspiration-keynote-gs2.html",
            "id": "6a6352ba-39df-3a99-95f4-7af8b9e650f9",
            "sortDate": "2024-10-15T14:00:00.000Z",
            "sessionTitle": "Inspiration Keynote",
            "sessionCode": "GS2",
            "sessionDuration": "90",
            "sessionEndTime": "2024-10-15T15:30:00.000Z",
            "sessionId": "1718043189850001tWtp",
            "sessionStartTime": "2024-10-15T14:00:00.000Z",
            "sessionTimeId": "1718043295245001SHUS",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-whats-new-in-illustrator-with-magdiel-l-al689.html",
            "id": "2cb61093-a1cf-3199-ba68-b36991d990a3",
            "sortDate": "2024-10-15T15:30:00.000Z",
            "sessionTitle": "First Take: What’s New in Illustrator with Magdiel Lopez",
            "sessionCode": "AL689",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T16:30:00.000Z",
            "sessionId": "1724353959447001xmuE",
            "sessionStartTime": "2024-10-15T15:30:00.000Z",
            "sessionTimeId": "1724453842379001tv4v",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/creativity-reimagined-connections-in-the-era-of-ai-os713.html",
            "id": "a5797cea-4e17-3854-a0d7-6de36ac02092",
            "sortDate": "2024-10-15T16:00:00.000Z",
            "sessionTitle": "Creativity Reimagined: Connections in the era of AI",
            "sessionCode": "OS713",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T16:30:00.000Z",
            "sessionId": "1721759573252001rxSS",
            "sessionStartTime": "2024-10-15T16:00:00.000Z",
            "sessionTimeId": "1725575854031001WmIy",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                "title": "Creativity and Design in Business"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/how-to-best-capture-the-magic-of-a-destination-os421.html",
            "id": "57187a63-d12e-30f9-858c-ded13be723e1",
            "sortDate": "2024-10-15T16:00:00.000Z",
            "sessionTitle": "How to Best Capture the Magic of a Destination in Photos",
            "sessionCode": "OS421",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T16:30:00.000Z",
            "sessionId": "1717022647915001mqv0",
            "sessionStartTime": "2024-10-15T16:00:00.000Z",
            "sessionTimeId": "1718285285213001sWiP",
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/designing-a-book-cover-inspiration-and-design-os310.html",
            "id": "976cfb67-efcc-3a7f-b670-49336b4d00c1",
            "sortDate": "2024-10-15T16:00:00.000Z",
            "sessionTitle": "Designing a Book Cover: Inspiration and Design Tricks",
            "sessionCode": "OS310",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T16:30:00.000Z",
            "sessionId": "1718040858856001uRgi",
            "sessionStartTime": "2024-10-15T16:00:00.000Z",
            "sessionTimeId": "1718285662478001SNI3",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-after-effects-101-after-effects-for-new-users-os630.html",
            "id": "8a60e2c2-6b19-3e39-9850-e29d03901a56",
            "sortDate": "2024-10-15T16:00:00.000Z",
            "sessionTitle": "After Effects 101: After Effects for New Users",
            "sessionCode": "OS630",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T16:30:00.000Z",
            "sessionId": "1713997983387001Y22V",
            "sessionStartTime": "2024-10-15T16:00:00.000Z",
            "sessionTimeId": "1718285432741001hpak",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/postproduction-magic-with-latest-premiere-pro-os803.html",
            "id": "74f5a24a-cbe4-38ca-a80d-d5450b4c91ba",
            "sortDate": "2024-10-15T16:00:00.000Z",
            "sessionTitle": "Post-production Magic with Latest Premiere Pro AI Features ",
            "sessionCode": "OS803",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T16:30:00.000Z",
            "sessionId": "1718231460274001SEMQ",
            "sessionStartTime": "2024-10-15T16:00:00.000Z",
            "sessionTimeId": "1722017615024001V71y",
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
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/enhancing-reading-visualization-with-adobe-express-os200.html",
            "id": "4142af8b-30ea-34b4-911d-e4a27efddd91",
            "sortDate": "2024-10-15T16:30:00.000Z",
            "sessionTitle": "Enhancing Reading Visualization with Adobe Express & Gen AI",
            "sessionCode": "OS200",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:00:00.000Z",
            "sessionId": "1713895866762001cqiW",
            "sessionStartTime": "2024-10-15T16:30:00.000Z",
            "sessionTimeId": "1718284895506001ug7u",
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
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/elevating-your-social-media-content-with-adobe-ex-os513.html",
            "id": "928264c6-c138-375e-9986-08ce197f3f30",
            "sortDate": "2024-10-15T16:30:00.000Z",
            "sessionTitle": "Elevating Your Social Media Content with Adobe Express",
            "sessionCode": "OS513",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:00:00.000Z",
            "sessionId": "1713813251103001fEFg",
            "sessionStartTime": "2024-10-15T16:30:00.000Z",
            "sessionTimeId": "1718285375253001snGD",
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
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/powerhouse-design-trio-photoshop-illustrator-os320.html",
            "id": "b7d174c5-8954-3d43-a135-a609dec482f6",
            "sortDate": "2024-10-15T16:30:00.000Z",
            "sessionTitle": "Powerhouse Design Trio: Photoshop + Illustrator + InDesign",
            "sessionCode": "OS320",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:00:00.000Z",
            "sessionId": "1715380279273001YAg1",
            "sessionStartTime": "2024-10-15T16:30:00.000Z",
            "sessionTimeId": "1718285234435001SnCQ",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-lightroom-for-mobile-with-toren-reaves-al688.html",
            "id": "54600927-a3fe-3d3f-9b27-0f27ef9e1a99",
            "sortDate": "2024-10-15T16:30:00.000Z",
            "sessionTitle": "First Take: Lightroom for Mobile with Toren Reaves",
            "sessionCode": "AL688",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T17:30:00.000Z",
            "sessionId": "1724353780986001fZN1",
            "sessionStartTime": "2024-10-15T16:30:00.000Z",
            "sessionTimeId": "1724694118456001XyYe",
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/nextgeneration-editing-workflows-for-video-os702.html",
            "id": "905456ea-f3e6-3296-b8a8-2eb8cc0a7691",
            "sortDate": "2024-10-15T16:30:00.000Z",
            "sessionTitle": "Next-Generation Editing Workflows for Video Creators",
            "sessionCode": "OS702",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:00:00.000Z",
            "sessionId": "1714750000728001WxA7",
            "sessionStartTime": "2024-10-15T16:30:00.000Z",
            "sessionTimeId": "1724183005800001i33p",
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
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/max/track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
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
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
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
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-integrate-3d-with-photoshop-os100.html",
            "id": "7fd9b928-c857-393b-8637-1e1e8a103c35",
            "sortDate": "2024-10-15T17:00:00.000Z",
            "sessionTitle": "Integrate 3D with Photoshop Using the Substance 3D Viewer Beta App",
            "sessionCode": "OS100",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:30:00.000Z",
            "sessionId": "1715622246336001zFeR",
            "sessionStartTime": "2024-10-15T17:00:00.000Z",
            "sessionTimeId": "1718284835465001sEmP",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/3d",
                "title": "3D"
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
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/successfully-scaling-creativity-in-an-ai-wonderlan-os706.html",
            "id": "d4e1e5c7-9dc5-324d-81b4-b09b7ab4dfaf",
            "sortDate": "2024-10-15T17:00:00.000Z",
            "sessionTitle": "Successfully Scaling Creativity in an AI Wonderland",
            "sessionCode": "OS706",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:30:00.000Z",
            "sessionId": "1716323410583001EvLf",
            "sessionStartTime": "2024-10-15T17:00:00.000Z",
            "sessionTimeId": "1725397410706001Houy",
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
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
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
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-aipowered-innovation-leaping-ahead-os110.html",
            "id": "c76adda0-0de4-3ba7-95bf-396607ec6636",
            "sortDate": "2024-10-15T17:00:00.000Z",
            "sessionTitle": "AI-Powered Innovation: Leaping Ahead and Staying There",
            "sessionCode": "OS110",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:30:00.000Z",
            "sessionId": "1721747444274001mNh3",
            "sessionStartTime": "2024-10-15T17:00:00.000Z",
            "sessionTimeId": "1721928727934001rHbH",
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
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-moving-your-brand-into-video-os631.html",
            "id": "73fb60e6-eb23-394a-9edd-0cf7a9591ff5",
            "sortDate": "2024-10-15T17:00:00.000Z",
            "sessionTitle": "Moving Your Brand into Video",
            "sessionCode": "OS631",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:30:00.000Z",
            "sessionId": "1718136158575001dCOi",
            "sessionStartTime": "2024-10-15T17:00:00.000Z",
            "sessionTimeId": "1718285467433001w2Hn",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-enhancing-your-work-through-cinematic-color-os805.html",
            "id": "266e3144-ed69-3d43-b052-0bcd513b91e4",
            "sortDate": "2024-10-15T17:00:00.000Z",
            "sessionTitle": "Enhancing Your Work Through Cinematic Color Grading",
            "sessionCode": "OS805",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T17:30:00.000Z",
            "sessionId": "1718231460361001SotF",
            "sessionStartTime": "2024-10-15T17:00:00.000Z",
            "sessionTimeId": "1722017400121001vnq2",
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
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-evan-mcnaught-al691.html",
            "id": "69789f7f-3cbe-357b-8c9e-587afb870603",
            "sortDate": "2024-10-15T17:30:00.000Z",
            "sessionTitle": "Meet the Speaker: Evan McNaught",
            "sessionCode": "AL691",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T18:00:00.000Z",
            "sessionId": "1724354373792001y0ei",
            "sessionStartTime": "2024-10-15T17:30:00.000Z",
            "sessionTimeId": "1724453889556001tcQq",
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
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/creativity-super-session-graphic-design-ss1.html",
            "id": "26674968-0f56-3140-a08a-d21e4cefd04d",
            "sortDate": "2024-10-15T17:30:00.000Z",
            "sessionTitle": "Creativity Super Session: Graphic Design",
            "sessionCode": "SS1",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T18:30:00.000Z",
            "sessionId": "1709835444600001DEST",
            "sessionStartTime": "2024-10-15T17:30:00.000Z",
            "sessionTimeId": "1717633345724001lPhV",
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
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/creative-super-session",
                    "title": "Creativity Super Session"
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
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-updates-in-premiere-pro-with-chris-hans-al692.html",
            "id": "0a2e865e-8d35-3449-b0cf-3f07af6335ed",
            "sortDate": "2024-10-15T18:00:00.000Z",
            "sessionTitle": "First Take: Updates in Premiere Pro with James Bonanno - AL692",
            "sessionCode": "AL692",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T18:30:00.000Z",
            "sessionId": "1724354532492001DqyL",
            "sessionStartTime": "2024-10-15T18:00:00.000Z",
            "sessionTimeId": "1724453931891001pyOL",
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/portrait-photography-editing-with-ai-os709.html",
            "id": "dc082b66-8eb0-31a4-bf05-52184f2f7238",
            "sortDate": "2024-10-15T18:30:00.000Z",
            "sessionTitle": "Portrait Photography Editing with AI ",
            "sessionCode": "OS709",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:00:00.000Z",
            "sessionId": "1716323410961001EA4g",
            "sessionStartTime": "2024-10-15T18:30:00.000Z",
            "sessionTimeId": "1724882177301001XP0t",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/mastering-lowlight-photography-from-capture-os423.html",
            "id": "298a76a0-090b-37ba-8148-da858b228621",
            "sortDate": "2024-10-15T18:30:00.000Z",
            "sessionTitle": "Mastering Low-Light Photography from Capture to Edit",
            "sessionCode": "OS423",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:00:00.000Z",
            "sessionId": "1721667407674001yI4B",
            "sessionStartTime": "2024-10-15T18:30:00.000Z",
            "sessionTimeId": "1723789674541001U6l9",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/how-iconic-brands-use-color-to-connect-with-custom-os710.html",
            "id": "d44f398f-79ed-3699-8b9b-a4a638d79d95",
            "sortDate": "2024-10-15T18:30:00.000Z",
            "sessionTitle": "How Iconic Brands Use Color to Connect with Customers",
            "sessionCode": "OS710",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:00:00.000Z",
            "sessionId": "1721757690679001VXOk",
            "sessionStartTime": "2024-10-15T18:30:00.000Z",
            "sessionTimeId": "1725997518101001UsMk",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-new-and-incredible-innovations-in-photoshop-os322.html",
            "id": "5ff52ebc-2cdc-3d33-a3d1-c39483646f33",
            "sortDate": "2024-10-15T18:30:00.000Z",
            "sessionTitle": "New and Incredible Innovations in Photoshop",
            "sessionCode": "OS322",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:00:00.000Z",
            "sessionId": "1719604963124001vh8j",
            "sessionStartTime": "2024-10-15T18:30:00.000Z",
            "sessionTimeId": "1720468056275001DYUM",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/meet-the-speaker-jason-naylor-al693.html",
            "id": "87c9f3bd-bb8b-3c37-bd05-6fa2e97ece3a",
            "sortDate": "2024-10-15T18:30:00.000Z",
            "sessionTitle": "Meet the Speaker: Jason Naylor",
            "sessionCode": "AL693",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T19:30:00.000Z",
            "sessionId": "1724354653464001Wta9",
            "sessionStartTime": "2024-10-15T18:30:00.000Z",
            "sessionTimeId": "1724453979870001Ien2",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/meet-the-speaker",
                    "title": "Meet the Speaker"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/sizzling-stats-how-texas-roadhouse-serves-up-creat-os712.html",
            "id": "b7041519-a5ee-38bc-9ed5-99e50cfec24a",
            "sortDate": "2024-10-15T19:00:00.000Z",
            "sessionTitle": "Sizzling Stats: How Texas Roadhouse Serves Up Creative ROI",
            "sessionCode": "OS712",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:30:00.000Z",
            "sessionId": "1721759550366001vvFW",
            "sessionStartTime": "2024-10-15T19:00:00.000Z",
            "sessionTimeId": "1724790707305001WzaL",
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
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
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
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/maximize-acrobat-efficiency-with-generative-ai-os703.html",
            "id": "debc68b1-fe70-35ca-8d6f-89eed3195c2a",
            "sortDate": "2024-10-15T19:00:00.000Z",
            "sessionTitle": "Maximize Acrobat Efficiency with Generative AI",
            "sessionCode": "OS703",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:30:00.000Z",
            "sessionId": "1716323410181001EaMi",
            "sessionStartTime": "2024-10-15T19:00:00.000Z",
            "sessionTimeId": "1721055933186001PdAI",
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
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/products/acrobat",
                    "title": "Acrobat"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/max/category/running-your-business",
                    "title": "Running Your Business"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/beating-algorithms-social-strategies-for-driving-os511.html",
            "id": "a9e3c077-60c6-3bf3-969f-96dea270fa3e",
            "sortDate": "2024-10-15T19:00:00.000Z",
            "sessionTitle": "Beating Algorithms: Social Strategies for Driving Growth",
            "sessionCode": "OS511",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:30:00.000Z",
            "sessionId": "1713813075993001AyUV",
            "sessionStartTime": "2024-10-15T19:00:00.000Z",
            "sessionTimeId": "1718285334766001usWp",
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
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/max/category/industry-best-practices",
                    "title": "Industry Best Practices"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/na-turning-your-art-doodles-and-lettering-into-fun-os301.html",
            "id": "15e6a95a-58ce-3ca4-aead-3e4981bdbf6d",
            "sortDate": "2024-10-15T19:00:00.000Z",
            "sessionTitle": "Turning Your Art Doodles and Lettering into Fun Patterns",
            "sessionCode": "OS301",
            "sessionDuration": "30",
            "sessionEndTime": "2024-10-15T19:30:00.000Z",
            "sessionId": "1716331755567001HrI3",
            "sessionStartTime": "2024-10-15T19:00:00.000Z",
            "sessionTimeId": "1718285189452001sUaB",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
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
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/creativity-super-session-video-and-ai-ss3.html",
            "id": "41547ed4-f5f4-38e4-ae83-0f8d684be997",
            "sortDate": "2024-10-15T19:30:00.000Z",
            "sessionTitle": "Creativity Super Session: Video and AI",
            "sessionCode": "SS3",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-15T20:30:00.000Z",
            "sessionId": "1709835444719001DVgX",
            "sessionStartTime": "2024-10-15T19:30:00.000Z",
            "sessionTimeId": "1717633819227001PpiM",
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
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/creative-super-session",
                    "title": "Creativity Super Session"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/max-sneaks-asl-gs3-0.html",
            "id": "ca88d7fd-9e6e-3942-b197-9b07ce1eebb6",
            "sortDate": "2024-10-15T21:30:00.000Z",
            "sessionTitle": "MAX Sneaks - ASL",
            "sessionCode": "GS3-0",
            "sessionDuration": "90",
            "sessionEndTime": "2024-10-15T23:00:00.000Z",
            "sessionId": "1720542327010001H7Sb",
            "sessionStartTime": "2024-10-15T21:30:00.000Z",
            "sessionTimeId": "1727974009379001oLGf",
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/max-sneaks-gs3.html",
            "id": "e3fa4136-e756-3900-a6d1-fc851b53d823",
            "sortDate": "2024-10-15T21:30:00.000Z",
            "sessionTitle": "MAX Sneaks",
            "sessionCode": "GS3",
            "sessionDuration": "90",
            "sessionEndTime": "2024-10-15T23:00:00.000Z",
            "sessionId": "1718043341876001ROcT",
            "sessionStartTime": "2024-10-15T21:30:00.000Z",
            "sessionTimeId": "1718043418728001w926",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/project-know-how-gs3-7.html",
            "id": "2a463545-e75e-3920-b9cd-fee9d8c3a262",
            "sortDate": "2024-10-15T21:30:00.000Z",
            "sessionTitle": "Project Know How",
            "sessionCode": "GS3-7",
            "sessionDuration": "10",
            "sessionEndTime": "2024-10-15T21:40:00.000Z",
            "sessionId": "1722018853858001vRza",
            "sessionStartTime": "2024-10-15T21:30:00.000Z",
            "sessionTimeId": "1728509295681001KOoo",
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person/on-demand-post-event",
                    "title": "On demand post event"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/project-scenic-gs3-8.html",
            "id": "f0700267-09d5-3ea1-a7c6-ce60c58cfc70",
            "sortDate": "2024-10-15T21:30:00.000Z",
            "sessionTitle": "Project Scenic",
            "sessionCode": "GS3-8",
            "sessionDuration": "10",
            "sessionEndTime": "2024-10-15T21:40:00.000Z",
            "sessionId": "1722018899551001v0Wa",
            "sessionStartTime": "2024-10-15T21:30:00.000Z",
            "sessionTimeId": "1728509335761001PizG",
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person/on-demand-post-event",
                    "title": "On demand post event"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/project-perfect-blend-gs3-6.html",
            "id": "7ed24c7d-219e-3075-9118-e9c725253999",
            "sortDate": "2024-10-15T21:30:00.000Z",
            "sessionTitle": "Project Perfect Blend",
            "sessionCode": "GS3-6",
            "sessionDuration": "10",
            "sessionEndTime": "2024-10-15T21:40:00.000Z",
            "sessionId": "1722018801533001r0xS",
            "sessionStartTime": "2024-10-15T21:30:00.000Z",
            "sessionTimeId": "1728509251435001Phyi",
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person/on-demand-post-event",
                    "title": "On demand post event"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/asia-pacific-inspiration-keynote-gs7.html",
            "id": "5bfae90e-2d35-3057-9091-92e4938b0183",
            "sortDate": "2024-10-16T02:00:00.000Z",
            "sessionTitle": "Asia Pacific Inspiration Keynote",
            "sessionCode": "GS7",
            "sessionDuration": "90",
            "sessionEndTime": "2024-10-16T03:30:00.000Z",
            "sessionId": "1721259318082001PpQI",
            "sessionStartTime": "2024-10-16T02:00:00.000Z",
            "sessionTimeId": "1721259529570001GxGG",
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
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-unseen-to-unforgettable-the-power-of-personal-os6003.html",
            "id": "85698ce1-66ed-318a-b84b-e8f67f9f31b8",
            "sortDate": "2024-10-16T04:00:00.000Z",
            "sessionTitle": "Unseen to Unforgettable: The Power of Personal Branding - APAC",
            "sessionCode": "OS6003",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-16T05:00:00.000Z",
            "sessionId": "1722104483766001effk",
            "sessionStartTime": "2024-10-16T04:00:00.000Z",
            "sessionTimeId": "1722106981080001pQ9f",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/css-humancentered-ai-strategies-for-creative-oss4.html",
            "id": "14c7f82d-9fa8-3f6f-9880-79e6de4b67e5",
            "sortDate": "2024-10-16T04:00:00.000Z",
            "sessionTitle": "Creativity Super Session: Human-Centered AI Strategies for Creative Leaders",
            "sessionCode": "OSS4",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-16T05:00:00.000Z",
            "sessionId": "1722108070668001viqO",
            "sessionStartTime": "2024-10-16T04:00:00.000Z",
            "sessionTimeId": "1722633888953001hTdf",
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
                    "tagId": "caas:events/max",
                    "title": "MAX"
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
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/max/category/generative-ai",
                    "title": "Generative AI"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/session-type/creative-super-session",
                    "title": "Creativity Super Session"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/apac-community-keynote-recap-what-updates-mean-for-al680.html",
            "id": "2d22f18b-fe2e-314b-8762-6851468c7d12",
            "sortDate": "2024-10-16T05:30:00.000Z",
            "sessionTitle": "Community Keynote Recap: What Updates Mean for Artists",
            "sessionCode": "AL680",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-16T06:15:00.000Z",
            "sessionId": "1724348402077001fb1M",
            "sessionStartTime": "2024-10-16T05:30:00.000Z",
            "sessionTimeId": "1725555237903001SEGR",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                "title": "Adobe Live @ MAX"
            },
            "tags": [
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
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
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
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
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
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
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-whats-new-in-illustrator-al698.html",
            "id": "8060aba4-d952-39e6-b26d-085b5467a0f8",
            "sortDate": "2024-10-16T10:00:00.000Z",
            "sessionTitle": "First Take: What’s New in Illustrator",
            "sessionCode": "AL698",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-16T11:00:00.000Z",
            "sessionId": "1724355370500001c7LL",
            "sessionStartTime": "2024-10-16T10:00:00.000Z",
            "sessionTimeId": "1724695126087001pwwJ",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/first-take-updates-in-premiere-pro-al699.html",
            "id": "beb14946-9b3b-3451-9c41-3f02c1271853",
            "sortDate": "2024-10-16T11:00:00.000Z",
            "sessionTitle": "First Take: Updates in Premiere Pro",
            "sessionCode": "AL699",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-16T12:00:00.000Z",
            "sessionId": "1724355493001001cCWE",
            "sessionStartTime": "2024-10-16T11:00:00.000Z",
            "sessionTimeId": "1724695228259001xB9D",
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
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
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
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/using-adobe-express-to-build-your-business-al700.html",
            "id": "6ab6a0c1-0092-3252-aefa-4d7ecdd45b61",
            "sortDate": "2024-10-16T12:00:00.000Z",
            "sessionTitle": "Using Adobe Express to Build Your Business",
            "sessionCode": "AL700",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-16T13:00:00.000Z",
            "sessionId": "1724355595170001cMwE",
            "sessionStartTime": "2024-10-16T12:00:00.000Z",
            "sessionTimeId": "1724695293355001ugma",
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
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
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
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/max/category/running-your-business",
                    "title": "Running Your Business"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/max-day-2-recap-al701.html",
            "id": "6c20b917-8e37-3a2c-8bbf-2cdca20a08c5",
            "sortDate": "2024-10-16T13:00:00.000Z",
            "sessionTitle": "MAX Day 2 Recap",
            "sessionCode": "AL701",
            "sessionDuration": "60",
            "sessionEndTime": "2024-10-16T14:00:00.000Z",
            "sessionId": "1724355916747001W4LZ",
            "sessionStartTime": "2024-10-16T13:00:00.000Z",
            "sessionTimeId": "1724695394002001uky5",
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
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
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
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
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
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
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
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                }
            ]
        },
        {
            "cardUrl": "https://www.stage.adobe.com/max/2024/sessions/acom-master-test-session-1005.html",
            "id": "f4cc85ba-0808-3600-8b8d-9bb1b5ad7177",
            "sortDate": "2024-10-16T15:00:00.000Z",
            "sessionTitle": "A.COM Master Test Session",
            "sessionCode": "1005",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-16T15:45:00.000Z",
            "sessionId": "1713813396202001u6BR",
            "sessionStartTime": "2024-10-16T15:00:00.000Z",
            "sessionTimeId": "1720550837935001fvBB",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                "title": "Graphic Design and Illustration"
            },
            "tags": [
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/on-demand",
                    "title": "On-Demand"
                },
                {
                    "tagId": "caas:events/products/substance-3d-sampler",
                    "title": "Substance 3D Sampler"
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
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/session-format/in-person/on-demand-post-event",
                    "title": "On demand post event"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
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
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
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
                    "tagId": "caas:events/products/pdf-api",
                    "title": "PDF API"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
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
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/max/category/creativity-in-the-classroom",
                    "title": "Creativity In The Classroom"
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
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
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
                    "tagId": "caas:events/max/primary-track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/products/character-animator",
                    "title": "Character Animator"
                },
                {
                    "tagId": "caas:events/max/track/graphic-design-and-illustration",
                    "title": "Graphic Design and Illustration"
                },
                {
                    "tagId": "caas:events/products/bridge",
                    "title": "Bridge"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-scan",
                    "title": "Adobe Scan"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/event-session-type/livestreamed-content/live",
                    "title": "Live"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/products/photoshop-express",
                    "title": "Photoshop Express"
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
                    "tagId": "caas:events/products/capture",
                    "title": "Capture"
                },
                {
                    "tagId": "caas:events/max/category/thought-leadership",
                    "title": "Thought Leadership"
                },
                {
                    "tagId": "caas:events/products/behance",
                    "title": "Behance"
                },
                {
                    "tagId": "caas:events/max/track/3d",
                    "title": "3D"
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
                    "tagId": "caas:events/audience-type/it",
                    "title": "IT"
                },
                {
                    "tagId": "caas:events/products/animate",
                    "title": "Animate"
                },
                {
                    "tagId": "caas:events/max/track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/products/reader",
                    "title": "Reader"
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
                    "tagId": "caas:events/products/substance-3d-assets",
                    "title": "Substance 3D Assets"
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
                    "tagId": "caas:events/max/track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/products/lightroom-on-mobile",
                    "title": "Lightroom on mobile"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
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
    // Only includes tracks that exist in the mock data
    tracks: [
        { id: 'live-broadcast', tagId: 'caas:events/max/primary-track/live-broadcast', title: 'Mainstage Broadcast', description: 'Don\'t miss the Mainstage Broadcast of Keynotes, Sneaks, Creativity Super Sessions, and Luminary Sessions.', color: '#FF6B00' },
        { id: 'adobe-live-at-max', tagId: 'caas:events/max/primary-track/adobe-live-at-max', title: 'Adobe Live @ MAX', description: 'Visit your favorite MAX speakers online to get your questions answered.', color: '#1473E6' },
        { id: 'creativity-and-design-in-business', tagId: 'caas:events/max/primary-track/creativity-and-design-in-business', title: 'Creativity and Design in Business', description: 'Inspiring speakers share their expertise and insights about creative leadership.', color: '#00A38F' },
        { id: 'video-audio-and-motion', tagId: 'caas:events/max/primary-track/video-audio-and-motion', title: 'Video, Audio, and Motion', description: 'Learn how to edit your first video and transform static graphics into motion.', color: '#9C27B0' },
        { id: 'photography', tagId: 'caas:events/max/primary-track/photography', title: 'Photography', description: 'Spark your passion for photography with sessions that will help you build your skills.', color: '#795548' },
        { id: 'social-media-and-marketing', tagId: 'caas:events/max/primary-track/social-media-and-marketing', title: 'Social Media and Marketing', description: 'Leverage the power of social media and marketing to elevate your brand.', color: '#3F51B5' },
        { id: 'education', tagId: 'caas:events/max/primary-track/education', title: 'Education', description: 'Get essential creative and generative AI skills that open doors to a brighter future.', color: '#FF9800' },
        { id: '3d', tagId: 'caas:events/max/primary-track/3d', title: '3D', description: 'Add the power of 3D to your design skillset and take your career to new heights.', color: '#FF5722' }
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
const LAST_DAY_SLOT = 95; // Last slot of day = 23:45 (slot 0 = 00:00, slot 1 = 00:15, ..., slot 95 = 23:45)
const PAGINATION_STEP = VISIBLE_TIME_SLOTS; // Move by 5 slots for normal pages (no overlap)

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
 * Get session end time with fallback calculation
 * Falls back to calculating from sessionStartTime + sessionDuration if sessionEndTime is missing
 */
function getSessionEndTime(session) {
    // If sessionEndTime exists, use it
    if (session.sessionEndTime) {
        // Debug logging for the specific session
        if (session.sessionTitle && session.sessionTitle.includes('A.COM Test Keynote')) {
            console.log('getSessionEndTime - using sessionEndTime:', {
                title: session.sessionTitle,
                sessionEndTime: session.sessionEndTime,
                expectedIST: new Date(new Date(session.sessionEndTime).getTime() + (5.5 * 60 * 60 * 1000)).toISOString()
            });
        }
        return session.sessionEndTime;
    }
    
    // Otherwise, calculate from start time + duration
    if (session.sessionStartTime && session.sessionDuration) {
        const startTime = new Date(session.sessionStartTime).getTime();
        const durationMinutes = parseInt(session.sessionDuration, 10);
        const endTime = startTime + (durationMinutes * MINUTE_MS);
        const calculatedEnd = new Date(endTime).toISOString();
        
        // Debug logging for the specific session
        if (session.sessionTitle && session.sessionTitle.includes('A.COM Test Keynote')) {
            console.log('getSessionEndTime - calculated from duration:', {
                title: session.sessionTitle,
                startTime: session.sessionStartTime,
                durationMinutes,
                calculatedEnd,
                expectedIST: new Date(endTime + (5.5 * 60 * 60 * 1000)).toISOString()
            });
        }
        
        return calculatedEnd;
    }
    
    // Fallback: return start time if no duration available
    return session.sessionStartTime || new Date().toISOString();
}

/**
 * Check if session is currently live
 */
function isSessionLive(session) {
    const now = Date.now();
    const start = new Date(session.sessionStartTime).getTime();
    const end = new Date(getSessionEndTime(session)).getTime();
    return now >= start && now <= end;
}

/**
 * Check if session is on demand (past session)
 */
function isSessionOnDemand(session) {
    const now = Date.now();
    const end = new Date(getSessionEndTime(session)).getTime();
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
                    <path d="M7.9,1.2C8,1.2,8.1,1,8.1,0.9c0,0,0,0,0,0s0,0,0,0c0-0.1-0.1-0.3-0.2-0.3C7.1,0.2,6.3,0,5.5,0L0,0c0.8,0,1.6-0.2,2.4-0.5c0.1-0.1,0.2-0.2,0.2-0.3c0,0,0,0,0,0s0,0,0,0C8.1,10,8,9.8,7.9,9.8C5.5,8.7,4.5,5.9,5.6,3.5C6.1,2.5,6.9,1.7,7.9,1.2L7.9,1.2z" fill="currentColor"/>
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
            
            // Initialize timeCursor to show the first session for the first day
            if (this.state.days.length > 0) {
                this.initializeTimeCursor();
            }
            
            this.state.isLoading = false;
        } catch (error) {
            // Handle error silently in production
            this.state.isLoading = false;
        }
    }

    /**
     * Initialize timeCursor to show the first session for the current day
     * Calculates offset based on earliest session start time (e.g., if first session is at 18:30, starts at that slot)
     */
    initializeTimeCursor() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) {
            this.state.timeCursor = 0;
            return;
        }

        const daySessions = this.getSessionsForCurrentDay();
        if (daySessions.length === 0) {
            this.state.timeCursor = 0;
            return;
        }

        // Find the earliest session start time for this day
        const earliestSessionTime = Math.min(
            ...daySessions.map(session => new Date(session.sessionStartTime).getTime())
        );

        const dayStartTime = new Date(currentDay.date + 'T00:00:00Z').getTime();
        
        // Calculate offset in slots from midnight (00:00)
        const earliestSlot = (earliestSessionTime - dayStartTime) / (TIME_SLOT_DURATION * MINUTE_MS);
        
        // Round down to the nearest slot to ensure we show the session
        this.state.timeCursor = Math.max(0, Math.floor(earliestSlot));
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
        
        // Ensure timeCursor doesn't exceed maxOffset (prevent crossing day boundary)
        // maxOffset = 91 ensures we show slots 91-95 (22:45-23:45) as the last page
        const maxOffset = this.getMaxTimeOffset();
        if (this.state.timeCursor > maxOffset) {
            this.state.timeCursor = maxOffset;
        }
        
        // Also ensure we don't show slots beyond the last slot of the day (95 = 23:45)
        // This provides an extra safety check
        const currentDay = this.state.days[this.state.currentDay];
        if (currentDay) {
            const maxPossibleOffset = LAST_DAY_SLOT - VISIBLE_TIME_SLOTS + 1; // Should be 91
            if (this.state.timeCursor > maxPossibleOffset) {
                this.state.timeCursor = maxPossibleOffset;
            }
        }
        
        // CRITICAL FIX: If timeCursor would result in fewer than 5 visible slots,
        // adjust it to show the last 5 slots (91-95) instead.
        // Example: If timeCursor is 93, we'd only show 3 slots (93, 94, 95).
        // Instead, we should show 5 slots (91, 92, 93, 94, 95) by setting timeCursor to 91.
        // Calculate how many slots would be visible from current timeCursor
        const slotsAvailableFromCursor = LAST_DAY_SLOT - this.state.timeCursor + 1;
        if (slotsAvailableFromCursor < VISIBLE_TIME_SLOTS && slotsAvailableFromCursor > 0) {
            // This means we'd show fewer than 5 slots, so adjust to show last 5 slots
            this.state.timeCursor = maxOffset; // Set to 91 to show slots 91-95
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
        const dayStartTime = new Date(currentDay.date + 'T00:00:00Z').getTime();
        const visibleStart = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);
        
        const sessionTiles = [];
        const occupiedCells = new Set();
        
        sessions.forEach(session => {
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(getSessionEndTime(session)).getTime();
            const duration = endTime - startTime;
            
            // Debug logging for the specific session
            if (session.sessionTitle && session.sessionTitle.includes('A.COM Test Keynote')) {
                console.log('Session calculation:', {
                    title: session.sessionTitle,
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString(),
                    durationMs: duration,
                    durationMinutes: duration / MINUTE_MS,
                    sessionEndTime: session.sessionEndTime,
                    sessionDuration: session.sessionDuration
                });
            }
            
            const startOffset = (startTime - visibleStart) / (TIME_SLOT_DURATION * MINUTE_MS);
            // Calculate end offset from end time
            // The endOffset should include the full slot that contains the end time
            // For example, if session ends at 15:00 UTC (20:30 IST), it should display
            // through the slot 20:15-20:30 IST, so we need to round up and add 1 slot
            const endOffsetRaw = (endTime - visibleStart) / (TIME_SLOT_DURATION * MINUTE_MS);
            // Round up to get the slot index, then add 1 to include the full slot
            // This ensures sessions ending at slot boundaries (like 15:00 UTC) 
            // properly display the complete last slot
            const endOffset = Math.ceil(endOffsetRaw) + 1;
            
            // Debug logging for the specific session
            if (session.sessionTitle && session.sessionTitle.includes('A.COM Test Keynote')) {
                console.log('Session slot calculation:', {
                    title: session.sessionTitle,
                    visibleStart: new Date(visibleStart).toISOString(),
                    startOffset,
                    endOffsetRaw,
                    endOffset
                });
            }
            
            // Render session if it overlaps with visible window (starts before/within and ends after/within)
            if (endOffset > 0 && startOffset < VISIBLE_TIME_SLOTS) {
                const track = this.state.tracks.find(t => t.tagId === session.sessionTrack.tagId);
                
                // Calculate visible portion of the session
                const visibleStartColumn = Math.max(1, Math.floor(startOffset) + 1);
                const visibleEndColumn = Math.min(Math.ceil(endOffset), VISIBLE_TIME_SLOTS + 1);
                const startColumn = visibleStartColumn;
                const endColumn = visibleEndColumn;
                
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
            const endTime = new Date(getSessionEndTime(session)).getTime();
            
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
                        ${shouldDisplayDuration ? `<footer>
                            <p class="duration">${durationText}</p>
                        </footer>` : ''}
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
        const minOffset = this.getMinTimeOffset();
        const maxOffset = this.getMaxTimeOffset();
        const hasNextDay = this.state.currentDay < this.state.days.length - 1;
        const hasPrevDay = this.state.currentDay > 0;
        
        // Next button should be enabled if there's more content in current day OR there's a next day
        const canGoNext = this.state.timeCursor < maxOffset || hasNextDay;
        // Prev button should be enabled if there's more content in current day OR there's a prev day
        const canGoPrev = this.state.timeCursor > minOffset || hasPrevDay;
        
        return `
            <button 
                class="agenda-block__pagination-btn prev" 
                data-direction="prev"
                ${!canGoPrev ? 'disabled' : ''}
                aria-label="${this.config.labels.prevAriaLabel || 'Previous'}">
                <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path id="Path_183918" data-name="Path 183918" d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" transform="translate(-5.951 -4.045)" fill="#747474"></path></svg>
            </button>
            <button 
                class="agenda-block__pagination-btn next" 
                data-direction="next"
                ${!canGoNext ? 'disabled' : ''}
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
     * Ensures slots don't cross day boundary (stops at 23:45 = slot 95)
     */
    getVisibleTimeSlots() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return [];

        const dayStartTime = new Date(currentDay.date + 'T00:00:00Z').getTime();
        const startTime = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);
        
        // Calculate end of day - the last slot is 95 (23:45), so the next slot would be 96 (00:00 next day)
        // dayEndTime = start of slot 96 = end of slot 95 = 00:00 next day
        const dayEndTime = dayStartTime + ((LAST_DAY_SLOT + 1) * TIME_SLOT_DURATION * MINUTE_MS);

        const slots = [];
        for (let i = 0; i < VISIBLE_TIME_SLOTS; i++) {
            // Calculate which slot number this is (0-95 for the current day)
            const slotNumber = this.state.timeCursor + i;
            
            // CRITICAL: Stop if we've exceeded the last slot of the day (slot 95 = 23:45)
            // Don't allow any slot beyond slot 95 - this prevents showing 00:00 from next day
            if (slotNumber > LAST_DAY_SLOT) {
                break;
            }
            
            const slotTime = startTime + (i * TIME_SLOT_DURATION * MINUTE_MS);
            
            // Additional safety check: ensure slotTime doesn't exceed dayEndTime
            // This provides a double-check against timezone or calculation issues
            if (slotTime >= dayEndTime) {
                break;
            }
            
            slots.push(slotTime);
        }
        return slots;
    }

    /**
     * Get min time offset for pagination (based on earliest session for the day)
     */
    getMinTimeOffset() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return 0;

        const daySessions = this.getSessionsForCurrentDay();
        if (daySessions.length === 0) return 0;

        // Find the earliest session start time for this day
        const earliestSessionTime = Math.min(
            ...daySessions.map(session => new Date(session.sessionStartTime).getTime())
        );

        const dayStartTime = new Date(currentDay.date + 'T00:00:00Z').getTime();
        
        // Calculate offset in slots from midnight (00:00)
        const earliestSlot = (earliestSessionTime - dayStartTime) / (TIME_SLOT_DURATION * MINUTE_MS);
        return Math.max(0, Math.floor(earliestSlot));
    }

    /**
     * Get max time offset for pagination
     * Returns the offset that shows the last 5 slots of the day (ending at 23:45)
     * Returns offset 91 to show slots 91-95 (22:45-23:45)
     */
    getMaxTimeOffset() {
        // Always return offset to show the last 5 slots (22:45-23:45)
        // Slot 91 = 22:45, slot 92 = 23:00, slot 93 = 23:15, slot 94 = 23:30, slot 95 = 23:45
        // maxOffset = LAST_DAY_SLOT - VISIBLE_TIME_SLOTS + 1 = 95 - 5 + 1 = 91
        return LAST_DAY_SLOT - VISIBLE_TIME_SLOTS + 1;
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
            this.initializeTimeCursor(); // Initialize to show first session for this day
            this.render();
            this.attachEventListeners();
        }
    }

    /**
     * Paginate time slots
     * Normal pages: Move by 5 slots (no overlap)
     * Last page before day boundary: Shows slots 91-95 (22:45-23:45) which naturally overlaps with previous page
     */
    paginate(direction) {
        const step = PAGINATION_STEP; // Move by 5 slots for normal pages (no overlap)
        const minOffset = this.getMinTimeOffset();
        const maxOffset = this.getMaxTimeOffset(); // Last page offset (91 for slots 91-95)

        if (direction === 'next') {
            // Check if we're already at the last page (maxOffset = 91, showing slots 91-95 = 22:45-23:45)
            if (this.state.timeCursor >= maxOffset) {
                // If already at last page, move to next day
                if (this.state.currentDay < this.state.days.length - 1) {
                    this.state.currentDay++;
                    // When moving to next day via pagination, always start at 00:00 (slot 0)
                    this.state.timeCursor = 0;
                    this.render();
                    this.attachEventListeners();
                    return; // Early return to avoid double render
                }
                // If at last page but no next day, stay at last page (offset 91)
                return;
            }
            
            // Calculate next position with normal step (5 slots)
            const nextPosition = this.state.timeCursor + step;
            
            // Check if next position would exceed or reach the last page
            if (nextPosition >= maxOffset) {
                // Snap to last page (offset 91) to show exactly the last 5 slots (22:45-23:45)
                this.state.timeCursor = maxOffset;
            } else {
                // Normal pagination: move forward by 5 slots (no overlap)
                this.state.timeCursor = nextPosition;
            }
        } else if (direction === 'prev' && this.state.timeCursor > minOffset) {
            // If we're at the last page (maxOffset = 91), go back to show the page before it
            // Last page shows slots 91-95 (22:45-23:45)
            // Previous page should show slots 86-90 (22:00-22:45), so offset should be 86
            if (this.state.timeCursor === maxOffset) {
                // Go back from last page (offset 91) to previous page (offset 86)
                const prevPageOffset = maxOffset - step; // 91 - 5 = 86
                this.state.timeCursor = Math.max(prevPageOffset, minOffset);
            } else {
                // Normal pagination: move backward by 5 slots (no overlap)
                this.state.timeCursor = Math.max(this.state.timeCursor - step, minOffset);
            }
        } else if (direction === 'prev' && this.state.timeCursor <= minOffset) {
            // If at minOffset and clicking prev, move to previous day's last page
            if (this.state.currentDay > 0) {
                // Calculate maxOffset before changing day
                const currentDay = this.state.days[this.state.currentDay];
                const daySessions = this.state.sessions.filter(session => {
                    const sessionDayKey = getDayKey(new Date(session.sessionStartTime).getTime());
                    return sessionDayKey === currentDay.id;
                });
                let prevDayMaxOffset = 0;
                if (daySessions.length > 0) {
                    const latestSessionEndTime = Math.max(
                        ...daySessions.map(session => new Date(getSessionEndTime(session)).getTime())
                    );
                    const dayStartTime = new Date(currentDay.date + 'T00:00:00Z').getTime();
                    const latestSessionEndSlot = (latestSessionEndTime - dayStartTime) / (TIME_SLOT_DURATION * MINUTE_MS);
                    const effectiveEndSlot = Math.max(LAST_DAY_SLOT, latestSessionEndSlot);
                    prevDayMaxOffset = Math.max(0, effectiveEndSlot - VISIBLE_TIME_SLOTS + 1);
                }
                
                this.state.currentDay--;
                this.state.timeCursor = prevDayMaxOffset;
            }
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
