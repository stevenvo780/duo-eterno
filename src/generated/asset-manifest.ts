/**
 * 🎨 MANIFEST DE ASSETS GENERADO AUTOMÁTICAMENTE
 * 
 * Este archivo se genera automáticamente ejecutando:
 * npm run sprite-loader
 * 
 * Contiene toda la estructura de assets organizados por carpetas
 */

export interface AnimationMetadata {
  name: string;
  frame_count: number;
  frame_size: [number, number];
  columns: number;
  rows: number;
  total_duration: number;
  loop: boolean;
  frames: Array<{ duration: number }>;
}

export interface AnimationAsset {
  id: string;
  name: string;
  jsonPath: string;
  spritePath: string;
  metadata: AnimationMetadata;
}

export interface StaticSpriteAsset {
  id: string;
  name: string;
  path: string;
  extension: string;
}

export interface AssetFolder {
  name: string;
  path: string;
  animations: AnimationAsset[];
  staticSprites: StaticSpriteAsset[];
  subfolders?: Record<string, AssetFolder>;
  totalAssets: number;
}

export const ASSET_MANIFEST: Record<string, AssetFolder> = {
  "activities": {
    "name": "activities",
    "path": "activities",
    "animations": [],
    "staticSprites": [
      {
        "id": "ARZone",
        "name": "ARZone",
        "path": "activities/ARZone.png",
        "extension": ".png"
      },
      {
        "id": "Air Europa",
        "name": "Air Europa",
        "path": "activities/Air Europa.png",
        "extension": ".png"
      },
      {
        "id": "AirBnB",
        "name": "AirBnB",
        "path": "activities/AirBnB.png",
        "extension": ".png"
      },
      {
        "id": "Amazon Prime",
        "name": "Amazon Prime",
        "path": "activities/Amazon Prime.png",
        "extension": ".png"
      },
      {
        "id": "Amazon Shopping",
        "name": "Amazon Shopping",
        "path": "activities/Amazon Shopping.png",
        "extension": ".png"
      },
      {
        "id": "Amazon",
        "name": "Amazon",
        "path": "activities/Amazon.png",
        "extension": ".png"
      },
      {
        "id": "ArtStation",
        "name": "ArtStation",
        "path": "activities/ArtStation.png",
        "extension": ".png"
      },
      {
        "id": "Authy",
        "name": "Authy",
        "path": "activities/Authy.png",
        "extension": ".png"
      },
      {
        "id": "Battle",
        "name": "Battle",
        "path": "activities/Battle.png",
        "extension": ".png"
      },
      {
        "id": "Booking",
        "name": "Booking",
        "path": "activities/Booking.png",
        "extension": ".png"
      },
      {
        "id": "CityMapper",
        "name": "CityMapper",
        "path": "activities/CityMapper.png",
        "extension": ".png"
      },
      {
        "id": "Cuenta DNI",
        "name": "Cuenta DNI",
        "path": "activities/Cuenta DNI.png",
        "extension": ".png"
      },
      {
        "id": "Deliveroo",
        "name": "Deliveroo",
        "path": "activities/Deliveroo.png",
        "extension": ".png"
      },
      {
        "id": "Deviantart",
        "name": "Deviantart",
        "path": "activities/Deviantart.png",
        "extension": ".png"
      },
      {
        "id": "Discord",
        "name": "Discord",
        "path": "activities/Discord.png",
        "extension": ".png"
      },
      {
        "id": "Duolingo",
        "name": "Duolingo",
        "path": "activities/Duolingo.png",
        "extension": ".png"
      },
      {
        "id": "Evernote",
        "name": "Evernote",
        "path": "activities/Evernote.png",
        "extension": ".png"
      },
      {
        "id": "Express VPN",
        "name": "Express VPN",
        "path": "activities/Express VPN.png",
        "extension": ".png"
      },
      {
        "id": "Facebook Messenger",
        "name": "Facebook Messenger",
        "path": "activities/Facebook Messenger.png",
        "extension": ".png"
      },
      {
        "id": "Facebook",
        "name": "Facebook",
        "path": "activities/Facebook.png",
        "extension": ".png"
      },
      {
        "id": "Firefox",
        "name": "Firefox",
        "path": "activities/Firefox.png",
        "extension": ".png"
      },
      {
        "id": "FitBod",
        "name": "FitBod",
        "path": "activities/FitBod.png",
        "extension": ".png"
      },
      {
        "id": "Galaxy Store",
        "name": "Galaxy Store",
        "path": "activities/Galaxy Store.png",
        "extension": ".png"
      },
      {
        "id": "Glovo",
        "name": "Glovo",
        "path": "activities/Glovo.png",
        "extension": ".png"
      },
      {
        "id": "Gmail",
        "name": "Gmail",
        "path": "activities/Gmail.png",
        "extension": ".png"
      },
      {
        "id": "Google Authentificator Old",
        "name": "Google Authentificator Old",
        "path": "activities/Google Authentificator Old.png",
        "extension": ".png"
      },
      {
        "id": "Google Authentificator",
        "name": "Google Authentificator",
        "path": "activities/Google Authentificator.png",
        "extension": ".png"
      },
      {
        "id": "Google Calendar",
        "name": "Google Calendar",
        "path": "activities/Google Calendar.png",
        "extension": ".png"
      },
      {
        "id": "Google Chrome",
        "name": "Google Chrome",
        "path": "activities/Google Chrome.png",
        "extension": ".png"
      },
      {
        "id": "Google Currents",
        "name": "Google Currents",
        "path": "activities/Google Currents.png",
        "extension": ".png"
      },
      {
        "id": "Google Docs",
        "name": "Google Docs",
        "path": "activities/Google Docs.png",
        "extension": ".png"
      },
      {
        "id": "Google Drive",
        "name": "Google Drive",
        "path": "activities/Google Drive.png",
        "extension": ".png"
      },
      {
        "id": "Google Files",
        "name": "Google Files",
        "path": "activities/Google Files.png",
        "extension": ".png"
      },
      {
        "id": "Google Fit",
        "name": "Google Fit",
        "path": "activities/Google Fit.png",
        "extension": ".png"
      },
      {
        "id": "Google Forms",
        "name": "Google Forms",
        "path": "activities/Google Forms.png",
        "extension": ".png"
      },
      {
        "id": "Google Hangouts",
        "name": "Google Hangouts",
        "path": "activities/Google Hangouts.png",
        "extension": ".png"
      },
      {
        "id": "Google Keep",
        "name": "Google Keep",
        "path": "activities/Google Keep.png",
        "extension": ".png"
      },
      {
        "id": "Google Launcher",
        "name": "Google Launcher",
        "path": "activities/Google Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Google Maps Old",
        "name": "Google Maps Old",
        "path": "activities/Google Maps Old.png",
        "extension": ".png"
      },
      {
        "id": "Google Maps",
        "name": "Google Maps",
        "path": "activities/Google Maps.png",
        "extension": ".png"
      },
      {
        "id": "Google Photos",
        "name": "Google Photos",
        "path": "activities/Google Photos.png",
        "extension": ".png"
      },
      {
        "id": "Google Playstore",
        "name": "Google Playstore",
        "path": "activities/Google Playstore.png",
        "extension": ".png"
      },
      {
        "id": "Google Podcasts",
        "name": "Google Podcasts",
        "path": "activities/Google Podcasts.png",
        "extension": ".png"
      },
      {
        "id": "Google Sheets",
        "name": "Google Sheets",
        "path": "activities/Google Sheets.png",
        "extension": ".png"
      },
      {
        "id": "Google Slides",
        "name": "Google Slides",
        "path": "activities/Google Slides.png",
        "extension": ".png"
      },
      {
        "id": "Google TV",
        "name": "Google TV",
        "path": "activities/Google TV.png",
        "extension": ".png"
      },
      {
        "id": "Google TalkBack",
        "name": "Google TalkBack",
        "path": "activities/Google TalkBack.png",
        "extension": ".png"
      },
      {
        "id": "Google Text to Speech",
        "name": "Google Text to Speech",
        "path": "activities/Google Text to Speech.png",
        "extension": ".png"
      },
      {
        "id": "Google Translate",
        "name": "Google Translate",
        "path": "activities/Google Translate.png",
        "extension": ".png"
      },
      {
        "id": "Google Wallet",
        "name": "Google Wallet",
        "path": "activities/Google Wallet.png",
        "extension": ".png"
      },
      {
        "id": "Google",
        "name": "Google",
        "path": "activities/Google.png",
        "extension": ".png"
      },
      {
        "id": "Idealista",
        "name": "Idealista",
        "path": "activities/Idealista.png",
        "extension": ".png"
      },
      {
        "id": "Instagram Old",
        "name": "Instagram Old",
        "path": "activities/Instagram Old.png",
        "extension": ".png"
      },
      {
        "id": "Instagram",
        "name": "Instagram",
        "path": "activities/Instagram.png",
        "extension": ".png"
      },
      {
        "id": "Itch io",
        "name": "Itch io",
        "path": "activities/Itch io.png",
        "extension": ".png"
      },
      {
        "id": "Ko Fi",
        "name": "Ko Fi",
        "path": "activities/Ko Fi.png",
        "extension": ".png"
      },
      {
        "id": "Letterboxd",
        "name": "Letterboxd",
        "path": "activities/Letterboxd.png",
        "extension": ".png"
      },
      {
        "id": "LinkedIn",
        "name": "LinkedIn",
        "path": "activities/LinkedIn.png",
        "extension": ".png"
      },
      {
        "id": "Lloyds Bank",
        "name": "Lloyds Bank",
        "path": "activities/Lloyds Bank.png",
        "extension": ".png"
      },
      {
        "id": "London Guide",
        "name": "London Guide",
        "path": "activities/London Guide.png",
        "extension": ".png"
      },
      {
        "id": "London Offline Map",
        "name": "London Offline Map",
        "path": "activities/London Offline Map.png",
        "extension": ".png"
      },
      {
        "id": "London Tube Map",
        "name": "London Tube Map",
        "path": "activities/London Tube Map.png",
        "extension": ".png"
      },
      {
        "id": "Mercadolibre",
        "name": "Mercadolibre",
        "path": "activities/Mercadolibre.png",
        "extension": ".png"
      },
      {
        "id": "Mercadopago",
        "name": "Mercadopago",
        "path": "activities/Mercadopago.png",
        "extension": ".png"
      },
      {
        "id": "Mi Argentina",
        "name": "Mi Argentina",
        "path": "activities/Mi Argentina.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Access",
        "name": "Microsoft Access",
        "path": "activities/Microsoft Access.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Authentificator",
        "name": "Microsoft Authentificator",
        "path": "activities/Microsoft Authentificator.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Edge",
        "name": "Microsoft Edge",
        "path": "activities/Microsoft Edge.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Excel",
        "name": "Microsoft Excel",
        "path": "activities/Microsoft Excel.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Launcher",
        "name": "Microsoft Launcher",
        "path": "activities/Microsoft Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Link to Windows",
        "name": "Microsoft Link to Windows",
        "path": "activities/Microsoft Link to Windows.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Office",
        "name": "Microsoft Office",
        "path": "activities/Microsoft Office.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft OneDrive",
        "name": "Microsoft OneDrive",
        "path": "activities/Microsoft OneDrive.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft OneNote",
        "name": "Microsoft OneNote",
        "path": "activities/Microsoft OneNote.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft PowerPoint",
        "name": "Microsoft PowerPoint",
        "path": "activities/Microsoft PowerPoint.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Publisher",
        "name": "Microsoft Publisher",
        "path": "activities/Microsoft Publisher.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft To Do",
        "name": "Microsoft To Do",
        "path": "activities/Microsoft To Do.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Word",
        "name": "Microsoft Word",
        "path": "activities/Microsoft Word.png",
        "extension": ".png"
      },
      {
        "id": "Miro",
        "name": "Miro",
        "path": "activities/Miro.png",
        "extension": ".png"
      },
      {
        "id": "Moj",
        "name": "Moj",
        "path": "activities/Moj.png",
        "extension": ".png"
      },
      {
        "id": "My Fitness Pal",
        "name": "My Fitness Pal",
        "path": "activities/My Fitness Pal.png",
        "extension": ".png"
      },
      {
        "id": "Netflix v2",
        "name": "Netflix v2",
        "path": "activities/Netflix v2.png",
        "extension": ".png"
      },
      {
        "id": "Netflix",
        "name": "Netflix",
        "path": "activities/Netflix.png",
        "extension": ".png"
      },
      {
        "id": "Notion",
        "name": "Notion",
        "path": "activities/Notion.png",
        "extension": ".png"
      },
      {
        "id": "Nova Launcher",
        "name": "Nova Launcher",
        "path": "activities/Nova Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Nuffield Health",
        "name": "Nuffield Health",
        "path": "activities/Nuffield Health.png",
        "extension": ".png"
      },
      {
        "id": "Opera",
        "name": "Opera",
        "path": "activities/Opera.png",
        "extension": ".png"
      },
      {
        "id": "Outlook",
        "name": "Outlook",
        "path": "activities/Outlook.png",
        "extension": ".png"
      },
      {
        "id": "Patreon",
        "name": "Patreon",
        "path": "activities/Patreon.png",
        "extension": ".png"
      },
      {
        "id": "PayPal",
        "name": "PayPal",
        "path": "activities/PayPal.png",
        "extension": ".png"
      },
      {
        "id": "PedidosYa",
        "name": "PedidosYa",
        "path": "activities/PedidosYa.png",
        "extension": ".png"
      },
      {
        "id": "Pikmin",
        "name": "Pikmin",
        "path": "activities/Pikmin.png",
        "extension": ".png"
      },
      {
        "id": "Pinterest",
        "name": "Pinterest",
        "path": "activities/Pinterest.png",
        "extension": ".png"
      },
      {
        "id": "Reddit",
        "name": "Reddit",
        "path": "activities/Reddit.png",
        "extension": ".png"
      },
      {
        "id": "Rubiks Cube",
        "name": "Rubiks Cube",
        "path": "activities/Rubiks Cube.png",
        "extension": ".png"
      },
      {
        "id": "Safari",
        "name": "Safari",
        "path": "activities/Safari.png",
        "extension": ".png"
      },
      {
        "id": "Samsung Free",
        "name": "Samsung Free",
        "path": "activities/Samsung Free.png",
        "extension": ".png"
      },
      {
        "id": "Santander",
        "name": "Santander",
        "path": "activities/Santander.png",
        "extension": ".png"
      },
      {
        "id": "Skype",
        "name": "Skype",
        "path": "activities/Skype.png",
        "extension": ".png"
      },
      {
        "id": "Slack v2",
        "name": "Slack v2",
        "path": "activities/Slack v2.png",
        "extension": ".png"
      },
      {
        "id": "Slack",
        "name": "Slack",
        "path": "activities/Slack.png",
        "extension": ".png"
      },
      {
        "id": "Snapchat",
        "name": "Snapchat",
        "path": "activities/Snapchat.png",
        "extension": ".png"
      },
      {
        "id": "SocioPlus",
        "name": "SocioPlus",
        "path": "activities/SocioPlus.png",
        "extension": ".png"
      },
      {
        "id": "SoundCloud",
        "name": "SoundCloud",
        "path": "activities/SoundCloud.png",
        "extension": ".png"
      },
      {
        "id": "Spareroom",
        "name": "Spareroom",
        "path": "activities/Spareroom.png",
        "extension": ".png"
      },
      {
        "id": "Spotify",
        "name": "Spotify",
        "path": "activities/Spotify.png",
        "extension": ".png"
      },
      {
        "id": "Steam",
        "name": "Steam",
        "path": "activities/Steam.png",
        "extension": ".png"
      },
      {
        "id": "Tarjeta Transporte Madrid",
        "name": "Tarjeta Transporte Madrid",
        "path": "activities/Tarjeta Transporte Madrid.png",
        "extension": ".png"
      },
      {
        "id": "Telegram",
        "name": "Telegram",
        "path": "activities/Telegram.png",
        "extension": ".png"
      },
      {
        "id": "Terraria",
        "name": "Terraria",
        "path": "activities/Terraria.png",
        "extension": ".png"
      },
      {
        "id": "Tfl Go",
        "name": "Tfl Go",
        "path": "activities/Tfl Go.png",
        "extension": ".png"
      },
      {
        "id": "Tfl Oyster",
        "name": "Tfl Oyster",
        "path": "activities/Tfl Oyster.png",
        "extension": ".png"
      },
      {
        "id": "TickTick",
        "name": "TickTick",
        "path": "activities/TickTick.png",
        "extension": ".png"
      },
      {
        "id": "TikTok",
        "name": "TikTok",
        "path": "activities/TikTok.png",
        "extension": ".png"
      },
      {
        "id": "Tinder",
        "name": "Tinder",
        "path": "activities/Tinder.png",
        "extension": ".png"
      },
      {
        "id": "Todoist",
        "name": "Todoist",
        "path": "activities/Todoist.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Blue Icon",
        "name": "Toggl Blue Icon",
        "path": "activities/Toggl Blue Icon.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Hire",
        "name": "Toggl Hire",
        "path": "activities/Toggl Hire.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Plan",
        "name": "Toggl Plan",
        "path": "activities/Toggl Plan.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Track",
        "name": "Toggl Track",
        "path": "activities/Toggl Track.png",
        "extension": ".png"
      },
      {
        "id": "Toggl",
        "name": "Toggl",
        "path": "activities/Toggl.png",
        "extension": ".png"
      },
      {
        "id": "Trello v2",
        "name": "Trello v2",
        "path": "activities/Trello v2.png",
        "extension": ".png"
      },
      {
        "id": "Trello",
        "name": "Trello",
        "path": "activities/Trello.png",
        "extension": ".png"
      },
      {
        "id": "Tumblr",
        "name": "Tumblr",
        "path": "activities/Tumblr.png",
        "extension": ".png"
      },
      {
        "id": "Twitch",
        "name": "Twitch",
        "path": "activities/Twitch.png",
        "extension": ".png"
      },
      {
        "id": "Twitter",
        "name": "Twitter",
        "path": "activities/Twitter.png",
        "extension": ".png"
      },
      {
        "id": "Uber Eats",
        "name": "Uber Eats",
        "path": "activities/Uber Eats.png",
        "extension": ".png"
      },
      {
        "id": "Uber",
        "name": "Uber",
        "path": "activities/Uber.png",
        "extension": ".png"
      },
      {
        "id": "Vitality GP",
        "name": "Vitality GP",
        "path": "activities/Vitality GP.png",
        "extension": ".png"
      },
      {
        "id": "Vitality",
        "name": "Vitality",
        "path": "activities/Vitality.png",
        "extension": ".png"
      },
      {
        "id": "Vivaldi",
        "name": "Vivaldi",
        "path": "activities/Vivaldi.png",
        "extension": ".png"
      },
      {
        "id": "Vodafone",
        "name": "Vodafone",
        "path": "activities/Vodafone.png",
        "extension": ".png"
      },
      {
        "id": "Whatsapp",
        "name": "Whatsapp",
        "path": "activities/Whatsapp.png",
        "extension": ".png"
      },
      {
        "id": "Wikipedia",
        "name": "Wikipedia",
        "path": "activities/Wikipedia.png",
        "extension": ".png"
      },
      {
        "id": "WinRAR",
        "name": "WinRAR",
        "path": "activities/WinRAR.png",
        "extension": ".png"
      },
      {
        "id": "Youtube",
        "name": "Youtube",
        "path": "activities/Youtube.png",
        "extension": ".png"
      },
      {
        "id": "Zoom",
        "name": "Zoom",
        "path": "activities/Zoom.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 137
  },
  "ambient": {
    "name": "ambient",
    "path": "ambient",
    "animations": [],
    "staticSprites": [
      {
        "id": "Banner_Stick_1_Purple",
        "name": "Banner Stick 1 Purple",
        "path": "ambient/Banner_Stick_1_Purple.png",
        "extension": ".png"
      },
      {
        "id": "Barrel_Small_Empty",
        "name": "Barrel Small Empty",
        "path": "ambient/Barrel_Small_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Basket_Empty",
        "name": "Basket Empty",
        "path": "ambient/Basket_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Bench_1",
        "name": "Bench 1",
        "path": "ambient/Bench_1.png",
        "extension": ".png"
      },
      {
        "id": "Bench_3",
        "name": "Bench 3",
        "path": "ambient/Bench_3.png",
        "extension": ".png"
      },
      {
        "id": "BulletinBoard_1",
        "name": "BulletinBoard 1",
        "path": "ambient/BulletinBoard_1.png",
        "extension": ".png"
      },
      {
        "id": "Chest",
        "name": "Chest",
        "path": "ambient/Chest.png",
        "extension": ".png"
      },
      {
        "id": "Chopped_Tree_1",
        "name": "Chopped Tree 1",
        "path": "ambient/Chopped_Tree_1.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Large_Empty",
        "name": "Crate Large Empty",
        "path": "ambient/Crate_Large_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Medium_Closed",
        "name": "Crate Medium Closed",
        "path": "ambient/Crate_Medium_Closed.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Water_1",
        "name": "Crate Water 1",
        "path": "ambient/Crate_Water_1.png",
        "extension": ".png"
      },
      {
        "id": "Fireplace_1",
        "name": "Fireplace 1",
        "path": "ambient/Fireplace_1.png",
        "extension": ".png"
      },
      {
        "id": "HayStack_2",
        "name": "HayStack 2",
        "path": "ambient/HayStack_2.png",
        "extension": ".png"
      },
      {
        "id": "LampPost_3",
        "name": "LampPost 3",
        "path": "ambient/LampPost_3.png",
        "extension": ".png"
      },
      {
        "id": "Plant_2",
        "name": "Plant 2",
        "path": "ambient/Plant_2.png",
        "extension": ".png"
      },
      {
        "id": "Sack_3",
        "name": "Sack 3",
        "path": "ambient/Sack_3.png",
        "extension": ".png"
      },
      {
        "id": "Sign_1",
        "name": "Sign 1",
        "path": "ambient/Sign_1.png",
        "extension": ".png"
      },
      {
        "id": "Sign_2",
        "name": "Sign 2",
        "path": "ambient/Sign_2.png",
        "extension": ".png"
      },
      {
        "id": "Table_Medium_1",
        "name": "Table Medium 1",
        "path": "ambient/Table_Medium_1.png",
        "extension": ".png"
      },
      {
        "id": "basuras1",
        "name": "basuras1",
        "path": "ambient/basuras1.png",
        "extension": ".png"
      },
      {
        "id": "basuras2",
        "name": "basuras2",
        "path": "ambient/basuras2.png",
        "extension": ".png"
      },
      {
        "id": "basuras3",
        "name": "basuras3",
        "path": "ambient/basuras3.png",
        "extension": ".png"
      },
      {
        "id": "basuras4",
        "name": "basuras4",
        "path": "ambient/basuras4.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle1",
        "name": "basuras calle1",
        "path": "ambient/basuras_calle1.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle2",
        "name": "basuras calle2",
        "path": "ambient/basuras_calle2.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle3",
        "name": "basuras calle3",
        "path": "ambient/basuras_calle3.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle4",
        "name": "basuras calle4",
        "path": "ambient/basuras_calle4.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle5",
        "name": "basuras calle5",
        "path": "ambient/basuras_calle5.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle6",
        "name": "basuras calle6",
        "path": "ambient/basuras_calle6.png",
        "extension": ".png"
      },
      {
        "id": "botellas1",
        "name": "botellas1",
        "path": "ambient/botellas1.png",
        "extension": ".png"
      },
      {
        "id": "botellas2",
        "name": "botellas2",
        "path": "ambient/botellas2.png",
        "extension": ".png"
      },
      {
        "id": "botellas3",
        "name": "botellas3",
        "path": "ambient/botellas3.png",
        "extension": ".png"
      },
      {
        "id": "cajas1",
        "name": "cajas1",
        "path": "ambient/cajas1.png",
        "extension": ".png"
      },
      {
        "id": "cajas2",
        "name": "cajas2",
        "path": "ambient/cajas2.png",
        "extension": ".png"
      },
      {
        "id": "cajas3",
        "name": "cajas3",
        "path": "ambient/cajas3.png",
        "extension": ".png"
      },
      {
        "id": "lamparas1",
        "name": "lamparas1",
        "path": "ambient/lamparas1.png",
        "extension": ".png"
      },
      {
        "id": "lamparas2",
        "name": "lamparas2",
        "path": "ambient/lamparas2.png",
        "extension": ".png"
      },
      {
        "id": "lamparas3",
        "name": "lamparas3",
        "path": "ambient/lamparas3.png",
        "extension": ".png"
      },
      {
        "id": "poste1",
        "name": "poste1",
        "path": "ambient/poste1.png",
        "extension": ".png"
      },
      {
        "id": "poste2",
        "name": "poste2",
        "path": "ambient/poste2.png",
        "extension": ".png"
      },
      {
        "id": "poste3",
        "name": "poste3",
        "path": "ambient/poste3.png",
        "extension": ".png"
      },
      {
        "id": "poste4",
        "name": "poste4",
        "path": "ambient/poste4.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas1",
        "name": "ropas tendidas1",
        "path": "ambient/ropas_tendidas1.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas2",
        "name": "ropas tendidas2",
        "path": "ambient/ropas_tendidas2.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas3",
        "name": "ropas tendidas3",
        "path": "ambient/ropas_tendidas3.png",
        "extension": ".png"
      },
      {
        "id": "silla",
        "name": "silla",
        "path": "ambient/silla.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle1",
        "name": "sillas de calle1",
        "path": "ambient/sillas_de_calle1.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle2",
        "name": "sillas de calle2",
        "path": "ambient/sillas_de_calle2.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle3",
        "name": "sillas de calle3",
        "path": "ambient/sillas_de_calle3.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle4",
        "name": "sillas de calle4",
        "path": "ambient/sillas_de_calle4.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla1",
        "name": "sombrilla1",
        "path": "ambient/sombrilla1.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla2",
        "name": "sombrilla2",
        "path": "ambient/sombrilla2.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla3",
        "name": "sombrilla3",
        "path": "ambient/sombrilla3.png",
        "extension": ".png"
      },
      {
        "id": "tile_0533_suelo_piedra",
        "name": "tile 0533 suelo piedra",
        "path": "ambient/tile_0533_suelo_piedra.png",
        "extension": ".png"
      },
      {
        "id": "tile_0542_tejado",
        "name": "tile 0542 tejado",
        "path": "ambient/tile_0542_tejado.png",
        "extension": ".png"
      },
      {
        "id": "tile_0545_suelo_piedra",
        "name": "tile 0545 suelo piedra",
        "path": "ambient/tile_0545_suelo_piedra.png",
        "extension": ".png"
      },
      {
        "id": "tile_0546_suelo_cesped",
        "name": "tile 0546 suelo cesped",
        "path": "ambient/tile_0546_suelo_cesped.png",
        "extension": ".png"
      },
      {
        "id": "tile_0547_suelo_arena",
        "name": "tile 0547 suelo arena",
        "path": "ambient/tile_0547_suelo_arena.png",
        "extension": ".png"
      },
      {
        "id": "tile_0548_suelo_tierra",
        "name": "tile 0548 suelo tierra",
        "path": "ambient/tile_0548_suelo_tierra.png",
        "extension": ".png"
      },
      {
        "id": "ventana1",
        "name": "ventana1",
        "path": "ambient/ventana1.png",
        "extension": ".png"
      },
      {
        "id": "ventana10",
        "name": "ventana10",
        "path": "ambient/ventana10.png",
        "extension": ".png"
      },
      {
        "id": "ventana11",
        "name": "ventana11",
        "path": "ambient/ventana11.png",
        "extension": ".png"
      },
      {
        "id": "ventana12",
        "name": "ventana12",
        "path": "ambient/ventana12.png",
        "extension": ".png"
      },
      {
        "id": "ventana13",
        "name": "ventana13",
        "path": "ambient/ventana13.png",
        "extension": ".png"
      },
      {
        "id": "ventana2",
        "name": "ventana2",
        "path": "ambient/ventana2.png",
        "extension": ".png"
      },
      {
        "id": "ventana3",
        "name": "ventana3",
        "path": "ambient/ventana3.png",
        "extension": ".png"
      },
      {
        "id": "ventana4",
        "name": "ventana4",
        "path": "ambient/ventana4.png",
        "extension": ".png"
      },
      {
        "id": "ventana5",
        "name": "ventana5",
        "path": "ambient/ventana5.png",
        "extension": ".png"
      },
      {
        "id": "ventana6",
        "name": "ventana6",
        "path": "ambient/ventana6.png",
        "extension": ".png"
      },
      {
        "id": "ventana7",
        "name": "ventana7",
        "path": "ambient/ventana7.png",
        "extension": ".png"
      },
      {
        "id": "ventana8",
        "name": "ventana8",
        "path": "ambient/ventana8.png",
        "extension": ".png"
      },
      {
        "id": "ventana9",
        "name": "ventana9",
        "path": "ambient/ventana9.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 72
  },
  "animations": {
    "name": "animations",
    "path": "animations",
    "animations": [
      {
        "id": "entidad_circulo_dying",
        "name": "sparkle",
        "jsonPath": "animations/entities/entidad_circulo_dying_anim.json",
        "spritePath": "animations/entities/entidad_circulo_dying_anim.png",
        "metadata": {
          "name": "sparkle",
          "frame_count": 20,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 3,
          "total_duration": 2400,
          "loop": true,
          "frames": [
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            }
          ]
        }
      },
      {
        "id": "entidad_circulo_happy",
        "name": "pulse",
        "jsonPath": "animations/entities/entidad_circulo_happy_anim.json",
        "spritePath": "animations/entities/entidad_circulo_happy_anim.png",
        "metadata": {
          "name": "pulse",
          "frame_count": 12,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 960,
          "loop": true,
          "frames": [
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            }
          ]
        }
      },
      {
        "id": "entidad_circulo_sad",
        "name": "floating",
        "jsonPath": "animations/entities/entidad_circulo_sad_anim.json",
        "spritePath": "animations/entities/entidad_circulo_sad_anim.png",
        "metadata": {
          "name": "floating",
          "frame_count": 16,
          "frame_size": [
            32,
            34
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 1600,
          "loop": true,
          "frames": [
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            }
          ]
        }
      },
      {
        "id": "entidad_square_dying",
        "name": "sparkle",
        "jsonPath": "animations/entities/entidad_square_dying_anim.json",
        "spritePath": "animations/entities/entidad_square_dying_anim.png",
        "metadata": {
          "name": "sparkle",
          "frame_count": 20,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 3,
          "total_duration": 2400,
          "loop": true,
          "frames": [
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            }
          ]
        }
      },
      {
        "id": "entidad_square_happy",
        "name": "pulse",
        "jsonPath": "animations/entities/entidad_square_happy_anim.json",
        "spritePath": "animations/entities/entidad_square_happy_anim.png",
        "metadata": {
          "name": "pulse",
          "frame_count": 12,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 960,
          "loop": true,
          "frames": [
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            }
          ]
        }
      },
      {
        "id": "entidad_square_sad",
        "name": "floating",
        "jsonPath": "animations/entities/entidad_square_sad_anim.json",
        "spritePath": "animations/entities/entidad_square_sad_anim.png",
        "metadata": {
          "name": "floating",
          "frame_count": 16,
          "frame_size": [
            32,
            34
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 1600,
          "loop": true,
          "frames": [
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            }
          ]
        }
      }
    ],
    "staticSprites": [
      {
        "id": "Baby Chicken Yellow",
        "name": "Baby Chicken Yellow",
        "path": "animations/Baby Chicken Yellow.png",
        "extension": ".png"
      },
      {
        "id": "Boar",
        "name": "Boar",
        "path": "animations/Boar.png",
        "extension": ".png"
      },
      {
        "id": "Campfire",
        "name": "Campfire",
        "path": "animations/Campfire.png",
        "extension": ".png"
      },
      {
        "id": "Chick",
        "name": "Chick",
        "path": "animations/Chick.png",
        "extension": ".png"
      },
      {
        "id": "Chicken Blonde  Green",
        "name": "Chicken Blonde  Green",
        "path": "animations/Chicken Blonde  Green.png",
        "extension": ".png"
      },
      {
        "id": "Chicken Red",
        "name": "Chicken Red",
        "path": "animations/Chicken Red.png",
        "extension": ".png"
      },
      {
        "id": "Chicken",
        "name": "Chicken",
        "path": "animations/Chicken.png",
        "extension": ".png"
      },
      {
        "id": "Female Cow Brown",
        "name": "Female Cow Brown",
        "path": "animations/Female Cow Brown.png",
        "extension": ".png"
      },
      {
        "id": "Flowers_Red",
        "name": "Flowers Red",
        "path": "animations/Flowers_Red.png",
        "extension": ".png"
      },
      {
        "id": "Flowers_White",
        "name": "Flowers White",
        "path": "animations/Flowers_White.png",
        "extension": ".png"
      },
      {
        "id": "HornedSheep",
        "name": "HornedSheep",
        "path": "animations/HornedSheep.png",
        "extension": ".png"
      },
      {
        "id": "Horse(32x32)",
        "name": "Horse(32x32)",
        "path": "animations/Horse(32x32).png",
        "extension": ".png"
      },
      {
        "id": "Idle",
        "name": "Idle",
        "path": "animations/Idle.png",
        "extension": ".png"
      },
      {
        "id": "Male Cow Brown",
        "name": "Male Cow Brown",
        "path": "animations/Male Cow Brown.png",
        "extension": ".png"
      },
      {
        "id": "MarineAnimals",
        "name": "MarineAnimals",
        "path": "animations/MarineAnimals.png",
        "extension": ".png"
      },
      {
        "id": "Pig",
        "name": "Pig",
        "path": "animations/Pig.png",
        "extension": ".png"
      },
      {
        "id": "Sheep",
        "name": "Sheep",
        "path": "animations/Sheep.png",
        "extension": ".png"
      },
      {
        "id": "Walk",
        "name": "Walk",
        "path": "animations/Walk.png",
        "extension": ".png"
      },
      {
        "id": "entidad_circulo_happy",
        "name": "entidad circulo happy",
        "path": "animations/entities/entidad_circulo_happy.png",
        "extension": ".png"
      }
    ],
    "subfolders": {
      "entities": {
        "name": "entities",
        "path": "animations/entities",
        "animations": [
          {
            "id": "entidad_circulo_dying",
            "name": "sparkle",
            "jsonPath": "animations/entities/entidad_circulo_dying_anim.json",
            "spritePath": "animations/entities/entidad_circulo_dying_anim.png",
            "metadata": {
              "name": "sparkle",
              "frame_count": 20,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 3,
              "total_duration": 2400,
              "loop": true,
              "frames": [
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                }
              ]
            }
          },
          {
            "id": "entidad_circulo_happy",
            "name": "pulse",
            "jsonPath": "animations/entities/entidad_circulo_happy_anim.json",
            "spritePath": "animations/entities/entidad_circulo_happy_anim.png",
            "metadata": {
              "name": "pulse",
              "frame_count": 12,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 960,
              "loop": true,
              "frames": [
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                }
              ]
            }
          },
          {
            "id": "entidad_circulo_sad",
            "name": "floating",
            "jsonPath": "animations/entities/entidad_circulo_sad_anim.json",
            "spritePath": "animations/entities/entidad_circulo_sad_anim.png",
            "metadata": {
              "name": "floating",
              "frame_count": 16,
              "frame_size": [
                32,
                34
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 1600,
              "loop": true,
              "frames": [
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                }
              ]
            }
          },
          {
            "id": "entidad_square_dying",
            "name": "sparkle",
            "jsonPath": "animations/entities/entidad_square_dying_anim.json",
            "spritePath": "animations/entities/entidad_square_dying_anim.png",
            "metadata": {
              "name": "sparkle",
              "frame_count": 20,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 3,
              "total_duration": 2400,
              "loop": true,
              "frames": [
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                }
              ]
            }
          },
          {
            "id": "entidad_square_happy",
            "name": "pulse",
            "jsonPath": "animations/entities/entidad_square_happy_anim.json",
            "spritePath": "animations/entities/entidad_square_happy_anim.png",
            "metadata": {
              "name": "pulse",
              "frame_count": 12,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 960,
              "loop": true,
              "frames": [
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                }
              ]
            }
          },
          {
            "id": "entidad_square_sad",
            "name": "floating",
            "jsonPath": "animations/entities/entidad_square_sad_anim.json",
            "spritePath": "animations/entities/entidad_square_sad_anim.png",
            "metadata": {
              "name": "floating",
              "frame_count": 16,
              "frame_size": [
                32,
                34
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 1600,
              "loop": true,
              "frames": [
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                }
              ]
            }
          }
        ],
        "staticSprites": [
          {
            "id": "entidad_circulo_happy",
            "name": "entidad circulo happy",
            "path": "animations/entities/entidad_circulo_happy.png",
            "extension": ".png"
          }
        ],
        "totalAssets": 7
      }
    },
    "totalAssets": 25
  },
  "buildings": {
    "name": "buildings",
    "path": "buildings",
    "animations": [],
    "staticSprites": [
      {
        "id": "CityWall_Gate_1",
        "name": "CityWall Gate 1",
        "path": "buildings/CityWall_Gate_1.png",
        "extension": ".png"
      },
      {
        "id": "Fences",
        "name": "Fences",
        "path": "buildings/Fences.png",
        "extension": ".png"
      },
      {
        "id": "House",
        "name": "House",
        "path": "buildings/House.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_1",
        "name": "House Hay 1",
        "path": "buildings/House_Hay_1.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_2",
        "name": "House Hay 2",
        "path": "buildings/House_Hay_2.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_3",
        "name": "House Hay 3",
        "path": "buildings/House_Hay_3.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_4_Purple",
        "name": "House Hay 4 Purple",
        "path": "buildings/House_Hay_4_Purple.png",
        "extension": ".png"
      },
      {
        "id": "Well_Hay_1",
        "name": "Well Hay 1",
        "path": "buildings/Well_Hay_1.png",
        "extension": ".png"
      },
      {
        "id": "muros1",
        "name": "muros1",
        "path": "buildings/muros1.png",
        "extension": ".png"
      },
      {
        "id": "muros2",
        "name": "muros2",
        "path": "buildings/muros2.png",
        "extension": ".png"
      },
      {
        "id": "muros3",
        "name": "muros3",
        "path": "buildings/muros3.png",
        "extension": ".png"
      },
      {
        "id": "vidrio",
        "name": "vidrio",
        "path": "buildings/vidrio.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 12
  },
  "dialogs": {
    "name": "dialogs",
    "path": "dialogs",
    "animations": [],
    "staticSprites": [],
    "totalAssets": 0
  },
  "food": {
    "name": "food",
    "path": "food",
    "animations": [],
    "staticSprites": [
      {
        "id": "01_dish",
        "name": "01 dish",
        "path": "food/01_dish.png",
        "extension": ".png"
      },
      {
        "id": "02_dish_2",
        "name": "02 dish 2",
        "path": "food/02_dish_2.png",
        "extension": ".png"
      },
      {
        "id": "03_dish_pile",
        "name": "03 dish pile",
        "path": "food/03_dish_pile.png",
        "extension": ".png"
      },
      {
        "id": "04_bowl",
        "name": "04 bowl",
        "path": "food/04_bowl.png",
        "extension": ".png"
      },
      {
        "id": "05_apple_pie",
        "name": "05 apple pie",
        "path": "food/05_apple_pie.png",
        "extension": ".png"
      },
      {
        "id": "06_apple_pie_dish",
        "name": "06 apple pie dish",
        "path": "food/06_apple_pie_dish.png",
        "extension": ".png"
      },
      {
        "id": "07_bread",
        "name": "07 bread",
        "path": "food/07_bread.png",
        "extension": ".png"
      },
      {
        "id": "08_bread_dish",
        "name": "08 bread dish",
        "path": "food/08_bread_dish.png",
        "extension": ".png"
      },
      {
        "id": "09_baguette",
        "name": "09 baguette",
        "path": "food/09_baguette.png",
        "extension": ".png"
      },
      {
        "id": "100_taco_dish",
        "name": "100 taco dish",
        "path": "food/100_taco_dish.png",
        "extension": ".png"
      },
      {
        "id": "101_waffle",
        "name": "101 waffle",
        "path": "food/101_waffle.png",
        "extension": ".png"
      },
      {
        "id": "102_waffle_dish",
        "name": "102 waffle dish",
        "path": "food/102_waffle_dish.png",
        "extension": ".png"
      },
      {
        "id": "10_baguette_dish",
        "name": "10 baguette dish",
        "path": "food/10_baguette_dish.png",
        "extension": ".png"
      },
      {
        "id": "11_bun",
        "name": "11 bun",
        "path": "food/11_bun.png",
        "extension": ".png"
      },
      {
        "id": "12_bun_dish",
        "name": "12 bun dish",
        "path": "food/12_bun_dish.png",
        "extension": ".png"
      },
      {
        "id": "13_bacon",
        "name": "13 bacon",
        "path": "food/13_bacon.png",
        "extension": ".png"
      },
      {
        "id": "14_bacon_dish",
        "name": "14 bacon dish",
        "path": "food/14_bacon_dish.png",
        "extension": ".png"
      },
      {
        "id": "15_burger",
        "name": "15 burger",
        "path": "food/15_burger.png",
        "extension": ".png"
      },
      {
        "id": "16_burger_dish",
        "name": "16 burger dish",
        "path": "food/16_burger_dish.png",
        "extension": ".png"
      },
      {
        "id": "17_burger_napkin",
        "name": "17 burger napkin",
        "path": "food/17_burger_napkin.png",
        "extension": ".png"
      },
      {
        "id": "18_burrito",
        "name": "18 burrito",
        "path": "food/18_burrito.png",
        "extension": ".png"
      },
      {
        "id": "19_burrito_dish",
        "name": "19 burrito dish",
        "path": "food/19_burrito_dish.png",
        "extension": ".png"
      },
      {
        "id": "20_bagel",
        "name": "20 bagel",
        "path": "food/20_bagel.png",
        "extension": ".png"
      },
      {
        "id": "21_bagel_dish",
        "name": "21 bagel dish",
        "path": "food/21_bagel_dish.png",
        "extension": ".png"
      },
      {
        "id": "22_cheesecake",
        "name": "22 cheesecake",
        "path": "food/22_cheesecake.png",
        "extension": ".png"
      },
      {
        "id": "23_cheesecake_dish",
        "name": "23 cheesecake dish",
        "path": "food/23_cheesecake_dish.png",
        "extension": ".png"
      },
      {
        "id": "24_cheesepuff",
        "name": "24 cheesepuff",
        "path": "food/24_cheesepuff.png",
        "extension": ".png"
      },
      {
        "id": "25_cheesepuff_bowl",
        "name": "25 cheesepuff bowl",
        "path": "food/25_cheesepuff_bowl.png",
        "extension": ".png"
      },
      {
        "id": "26_chocolate",
        "name": "26 chocolate",
        "path": "food/26_chocolate.png",
        "extension": ".png"
      },
      {
        "id": "27_chocolate_dish",
        "name": "27 chocolate dish",
        "path": "food/27_chocolate_dish.png",
        "extension": ".png"
      },
      {
        "id": "28_cookies",
        "name": "28 cookies",
        "path": "food/28_cookies.png",
        "extension": ".png"
      },
      {
        "id": "29_cookies_dish",
        "name": "29 cookies dish",
        "path": "food/29_cookies_dish.png",
        "extension": ".png"
      },
      {
        "id": "30_chocolatecake",
        "name": "30 chocolatecake",
        "path": "food/30_chocolatecake.png",
        "extension": ".png"
      },
      {
        "id": "31_chocolatecake_dish",
        "name": "31 chocolatecake dish",
        "path": "food/31_chocolatecake_dish.png",
        "extension": ".png"
      },
      {
        "id": "32_curry",
        "name": "32 curry",
        "path": "food/32_curry.png",
        "extension": ".png"
      },
      {
        "id": "33_curry_dish",
        "name": "33 curry dish",
        "path": "food/33_curry_dish.png",
        "extension": ".png"
      },
      {
        "id": "34_donut",
        "name": "34 donut",
        "path": "food/34_donut.png",
        "extension": ".png"
      },
      {
        "id": "35_donut_dish",
        "name": "35 donut dish",
        "path": "food/35_donut_dish.png",
        "extension": ".png"
      },
      {
        "id": "36_dumplings",
        "name": "36 dumplings",
        "path": "food/36_dumplings.png",
        "extension": ".png"
      },
      {
        "id": "37_dumplings_dish",
        "name": "37 dumplings dish",
        "path": "food/37_dumplings_dish.png",
        "extension": ".png"
      },
      {
        "id": "38_friedegg",
        "name": "38 friedegg",
        "path": "food/38_friedegg.png",
        "extension": ".png"
      },
      {
        "id": "39_friedegg_dish",
        "name": "39 friedegg dish",
        "path": "food/39_friedegg_dish.png",
        "extension": ".png"
      },
      {
        "id": "40_eggsalad",
        "name": "40 eggsalad",
        "path": "food/40_eggsalad.png",
        "extension": ".png"
      },
      {
        "id": "41_eggsalad_bowl",
        "name": "41 eggsalad bowl",
        "path": "food/41_eggsalad_bowl.png",
        "extension": ".png"
      },
      {
        "id": "42_eggtart",
        "name": "42 eggtart",
        "path": "food/42_eggtart.png",
        "extension": ".png"
      },
      {
        "id": "43_eggtart_dish",
        "name": "43 eggtart dish",
        "path": "food/43_eggtart_dish.png",
        "extension": ".png"
      },
      {
        "id": "44_frenchfries",
        "name": "44 frenchfries",
        "path": "food/44_frenchfries.png",
        "extension": ".png"
      },
      {
        "id": "45_frenchfries_dish",
        "name": "45 frenchfries dish",
        "path": "food/45_frenchfries_dish.png",
        "extension": ".png"
      },
      {
        "id": "46_fruitcake",
        "name": "46 fruitcake",
        "path": "food/46_fruitcake.png",
        "extension": ".png"
      },
      {
        "id": "47_fruitcake_dish",
        "name": "47 fruitcake dish",
        "path": "food/47_fruitcake_dish.png",
        "extension": ".png"
      },
      {
        "id": "48_garlicbread",
        "name": "48 garlicbread",
        "path": "food/48_garlicbread.png",
        "extension": ".png"
      },
      {
        "id": "49_garlicbread_dish",
        "name": "49 garlicbread dish",
        "path": "food/49_garlicbread_dish.png",
        "extension": ".png"
      },
      {
        "id": "50_giantgummybear",
        "name": "50 giantgummybear",
        "path": "food/50_giantgummybear.png",
        "extension": ".png"
      },
      {
        "id": "51_giantgummybear_dish",
        "name": "51 giantgummybear dish",
        "path": "food/51_giantgummybear_dish.png",
        "extension": ".png"
      },
      {
        "id": "52_gingerbreadman",
        "name": "52 gingerbreadman",
        "path": "food/52_gingerbreadman.png",
        "extension": ".png"
      },
      {
        "id": "53_gingerbreadman_dish",
        "name": "53 gingerbreadman dish",
        "path": "food/53_gingerbreadman_dish.png",
        "extension": ".png"
      },
      {
        "id": "54_hotdog",
        "name": "54 hotdog",
        "path": "food/54_hotdog.png",
        "extension": ".png"
      },
      {
        "id": "55_hotdog_sauce",
        "name": "55 hotdog sauce",
        "path": "food/55_hotdog_sauce.png",
        "extension": ".png"
      },
      {
        "id": "56_hotdog_dish",
        "name": "56 hotdog dish",
        "path": "food/56_hotdog_dish.png",
        "extension": ".png"
      },
      {
        "id": "57_icecream",
        "name": "57 icecream",
        "path": "food/57_icecream.png",
        "extension": ".png"
      },
      {
        "id": "58_icecream_bowl",
        "name": "58 icecream bowl",
        "path": "food/58_icecream_bowl.png",
        "extension": ".png"
      },
      {
        "id": "59_jelly",
        "name": "59 jelly",
        "path": "food/59_jelly.png",
        "extension": ".png"
      },
      {
        "id": "60_jelly_dish",
        "name": "60 jelly dish",
        "path": "food/60_jelly_dish.png",
        "extension": ".png"
      },
      {
        "id": "61_jam",
        "name": "61 jam",
        "path": "food/61_jam.png",
        "extension": ".png"
      },
      {
        "id": "62_jam_dish",
        "name": "62 jam dish",
        "path": "food/62_jam_dish.png",
        "extension": ".png"
      },
      {
        "id": "63_lemonpie",
        "name": "63 lemonpie",
        "path": "food/63_lemonpie.png",
        "extension": ".png"
      },
      {
        "id": "64_lemonpie_dish",
        "name": "64 lemonpie dish",
        "path": "food/64_lemonpie_dish.png",
        "extension": ".png"
      },
      {
        "id": "65_loafbread",
        "name": "65 loafbread",
        "path": "food/65_loafbread.png",
        "extension": ".png"
      },
      {
        "id": "66_loafbread_dish",
        "name": "66 loafbread dish",
        "path": "food/66_loafbread_dish.png",
        "extension": ".png"
      },
      {
        "id": "67_macncheese",
        "name": "67 macncheese",
        "path": "food/67_macncheese.png",
        "extension": ".png"
      },
      {
        "id": "68_macncheese_dish",
        "name": "68 macncheese dish",
        "path": "food/68_macncheese_dish.png",
        "extension": ".png"
      },
      {
        "id": "69_meatball",
        "name": "69 meatball",
        "path": "food/69_meatball.png",
        "extension": ".png"
      },
      {
        "id": "70_meatball_dish",
        "name": "70 meatball dish",
        "path": "food/70_meatball_dish.png",
        "extension": ".png"
      },
      {
        "id": "71_nacho",
        "name": "71 nacho",
        "path": "food/71_nacho.png",
        "extension": ".png"
      },
      {
        "id": "72_nacho_dish",
        "name": "72 nacho dish",
        "path": "food/72_nacho_dish.png",
        "extension": ".png"
      },
      {
        "id": "73_omlet",
        "name": "73 omlet",
        "path": "food/73_omlet.png",
        "extension": ".png"
      },
      {
        "id": "74_omlet_dish",
        "name": "74 omlet dish",
        "path": "food/74_omlet_dish.png",
        "extension": ".png"
      },
      {
        "id": "75_pudding",
        "name": "75 pudding",
        "path": "food/75_pudding.png",
        "extension": ".png"
      },
      {
        "id": "76_pudding_dish",
        "name": "76 pudding dish",
        "path": "food/76_pudding_dish.png",
        "extension": ".png"
      },
      {
        "id": "77_potatochips",
        "name": "77 potatochips",
        "path": "food/77_potatochips.png",
        "extension": ".png"
      },
      {
        "id": "78_potatochips_bowl",
        "name": "78 potatochips bowl",
        "path": "food/78_potatochips_bowl.png",
        "extension": ".png"
      },
      {
        "id": "79_pancakes",
        "name": "79 pancakes",
        "path": "food/79_pancakes.png",
        "extension": ".png"
      },
      {
        "id": "80_pancakes_dish",
        "name": "80 pancakes dish",
        "path": "food/80_pancakes_dish.png",
        "extension": ".png"
      },
      {
        "id": "81_pizza",
        "name": "81 pizza",
        "path": "food/81_pizza.png",
        "extension": ".png"
      },
      {
        "id": "82_pizza_dish",
        "name": "82 pizza dish",
        "path": "food/82_pizza_dish.png",
        "extension": ".png"
      },
      {
        "id": "83_popcorn",
        "name": "83 popcorn",
        "path": "food/83_popcorn.png",
        "extension": ".png"
      },
      {
        "id": "84_popcorn_bowl",
        "name": "84 popcorn bowl",
        "path": "food/84_popcorn_bowl.png",
        "extension": ".png"
      },
      {
        "id": "85_roastedchicken",
        "name": "85 roastedchicken",
        "path": "food/85_roastedchicken.png",
        "extension": ".png"
      },
      {
        "id": "86_roastedchicken_dish",
        "name": "86 roastedchicken dish",
        "path": "food/86_roastedchicken_dish.png",
        "extension": ".png"
      },
      {
        "id": "87_ramen",
        "name": "87 ramen",
        "path": "food/87_ramen.png",
        "extension": ".png"
      },
      {
        "id": "88_salmon",
        "name": "88 salmon",
        "path": "food/88_salmon.png",
        "extension": ".png"
      },
      {
        "id": "89_salmon_dish",
        "name": "89 salmon dish",
        "path": "food/89_salmon_dish.png",
        "extension": ".png"
      },
      {
        "id": "90_strawberrycake",
        "name": "90 strawberrycake",
        "path": "food/90_strawberrycake.png",
        "extension": ".png"
      },
      {
        "id": "91_strawberrycake_dish",
        "name": "91 strawberrycake dish",
        "path": "food/91_strawberrycake_dish.png",
        "extension": ".png"
      },
      {
        "id": "92_sandwich",
        "name": "92 sandwich",
        "path": "food/92_sandwich.png",
        "extension": ".png"
      },
      {
        "id": "93_sandwich_dish",
        "name": "93 sandwich dish",
        "path": "food/93_sandwich_dish.png",
        "extension": ".png"
      },
      {
        "id": "94_spaghetti",
        "name": "94 spaghetti",
        "path": "food/94_spaghetti.png",
        "extension": ".png"
      },
      {
        "id": "95_steak",
        "name": "95 steak",
        "path": "food/95_steak.png",
        "extension": ".png"
      },
      {
        "id": "96_steak_dish",
        "name": "96 steak dish",
        "path": "food/96_steak_dish.png",
        "extension": ".png"
      },
      {
        "id": "97_sushi",
        "name": "97 sushi",
        "path": "food/97_sushi.png",
        "extension": ".png"
      },
      {
        "id": "98_sushi_dish",
        "name": "98 sushi dish",
        "path": "food/98_sushi_dish.png",
        "extension": ".png"
      },
      {
        "id": "99_taco",
        "name": "99 taco",
        "path": "food/99_taco.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 102
  },
  "ground": {
    "name": "ground",
    "path": "ground",
    "animations": [],
    "staticSprites": [
      {
        "id": "FarmLand_Tile",
        "name": "FarmLand Tile",
        "path": "ground/FarmLand_Tile.png",
        "extension": ".png"
      },
      {
        "id": "Grass_Middle",
        "name": "Grass Middle",
        "path": "ground/Grass_Middle.png",
        "extension": ".png"
      },
      {
        "id": "Path_Middle",
        "name": "Path Middle",
        "path": "ground/Path_Middle.png",
        "extension": ".png"
      },
      {
        "id": "TexturedGrass",
        "name": "TexturedGrass",
        "path": "ground/TexturedGrass.png",
        "extension": ".png"
      },
      {
        "id": "cesped1",
        "name": "cesped1",
        "path": "ground/cesped1.png",
        "extension": ".png"
      },
      {
        "id": "cesped10",
        "name": "cesped10",
        "path": "ground/cesped10.png",
        "extension": ".png"
      },
      {
        "id": "cesped11",
        "name": "cesped11",
        "path": "ground/cesped11.png",
        "extension": ".png"
      },
      {
        "id": "cesped12",
        "name": "cesped12",
        "path": "ground/cesped12.png",
        "extension": ".png"
      },
      {
        "id": "cesped13",
        "name": "cesped13",
        "path": "ground/cesped13.png",
        "extension": ".png"
      },
      {
        "id": "cesped14",
        "name": "cesped14",
        "path": "ground/cesped14.png",
        "extension": ".png"
      },
      {
        "id": "cesped15",
        "name": "cesped15",
        "path": "ground/cesped15.png",
        "extension": ".png"
      },
      {
        "id": "cesped16",
        "name": "cesped16",
        "path": "ground/cesped16.png",
        "extension": ".png"
      },
      {
        "id": "cesped17",
        "name": "cesped17",
        "path": "ground/cesped17.png",
        "extension": ".png"
      },
      {
        "id": "cesped18",
        "name": "cesped18",
        "path": "ground/cesped18.png",
        "extension": ".png"
      },
      {
        "id": "cesped19",
        "name": "cesped19",
        "path": "ground/cesped19.png",
        "extension": ".png"
      },
      {
        "id": "cesped2",
        "name": "cesped2",
        "path": "ground/cesped2.png",
        "extension": ".png"
      },
      {
        "id": "cesped20",
        "name": "cesped20",
        "path": "ground/cesped20.png",
        "extension": ".png"
      },
      {
        "id": "cesped21",
        "name": "cesped21",
        "path": "ground/cesped21.png",
        "extension": ".png"
      },
      {
        "id": "cesped22",
        "name": "cesped22",
        "path": "ground/cesped22.png",
        "extension": ".png"
      },
      {
        "id": "cesped23",
        "name": "cesped23",
        "path": "ground/cesped23.png",
        "extension": ".png"
      },
      {
        "id": "cesped24",
        "name": "cesped24",
        "path": "ground/cesped24.png",
        "extension": ".png"
      },
      {
        "id": "cesped25",
        "name": "cesped25",
        "path": "ground/cesped25.png",
        "extension": ".png"
      },
      {
        "id": "cesped26",
        "name": "cesped26",
        "path": "ground/cesped26.png",
        "extension": ".png"
      },
      {
        "id": "cesped27",
        "name": "cesped27",
        "path": "ground/cesped27.png",
        "extension": ".png"
      },
      {
        "id": "cesped28",
        "name": "cesped28",
        "path": "ground/cesped28.png",
        "extension": ".png"
      },
      {
        "id": "cesped29",
        "name": "cesped29",
        "path": "ground/cesped29.png",
        "extension": ".png"
      },
      {
        "id": "cesped3",
        "name": "cesped3",
        "path": "ground/cesped3.png",
        "extension": ".png"
      },
      {
        "id": "cesped30",
        "name": "cesped30",
        "path": "ground/cesped30.png",
        "extension": ".png"
      },
      {
        "id": "cesped31",
        "name": "cesped31",
        "path": "ground/cesped31.png",
        "extension": ".png"
      },
      {
        "id": "cesped4",
        "name": "cesped4",
        "path": "ground/cesped4.png",
        "extension": ".png"
      },
      {
        "id": "cesped5",
        "name": "cesped5",
        "path": "ground/cesped5.png",
        "extension": ".png"
      },
      {
        "id": "cesped6",
        "name": "cesped6",
        "path": "ground/cesped6.png",
        "extension": ".png"
      },
      {
        "id": "cesped7",
        "name": "cesped7",
        "path": "ground/cesped7.png",
        "extension": ".png"
      },
      {
        "id": "cesped8",
        "name": "cesped8",
        "path": "ground/cesped8.png",
        "extension": ".png"
      },
      {
        "id": "cesped9",
        "name": "cesped9",
        "path": "ground/cesped9.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 35
  },
  "nature": {
    "name": "nature",
    "path": "nature",
    "animations": [],
    "staticSprites": [
      {
        "id": "Bush_Emerald_1",
        "name": "Bush Emerald 1",
        "path": "nature/Bush_Emerald_1.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_2",
        "name": "Bush Emerald 2",
        "path": "nature/Bush_Emerald_2.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_3",
        "name": "Bush Emerald 3",
        "path": "nature/Bush_Emerald_3.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_4",
        "name": "Bush Emerald 4",
        "path": "nature/Bush_Emerald_4.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_5",
        "name": "Bush Emerald 5",
        "path": "nature/Bush_Emerald_5.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_6",
        "name": "Bush Emerald 6",
        "path": "nature/Bush_Emerald_6.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_7",
        "name": "Bush Emerald 7",
        "path": "nature/Bush_Emerald_7.png",
        "extension": ".png"
      },
      {
        "id": "Oak_Tree",
        "name": "Oak Tree",
        "path": "nature/Oak_Tree.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_1",
        "name": "Rock Brown 1",
        "path": "nature/Rock_Brown_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_2",
        "name": "Rock Brown 2",
        "path": "nature/Rock_Brown_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_4",
        "name": "Rock Brown 4",
        "path": "nature/Rock_Brown_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_6",
        "name": "Rock Brown 6",
        "path": "nature/Rock_Brown_6.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_9",
        "name": "Rock Brown 9",
        "path": "nature/Rock_Brown_9.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_1",
        "name": "Tree Emerald 1",
        "path": "nature/Tree_Emerald_1.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_2",
        "name": "Tree Emerald 2",
        "path": "nature/Tree_Emerald_2.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_3",
        "name": "Tree Emerald 3",
        "path": "nature/Tree_Emerald_3.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_4",
        "name": "Tree Emerald 4",
        "path": "nature/Tree_Emerald_4.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 17
  },
  "roads": {
    "name": "roads",
    "path": "roads",
    "animations": [],
    "staticSprites": [],
    "totalAssets": 0
  },
  "water": {
    "name": "water",
    "path": "water",
    "animations": [],
    "staticSprites": [
      {
        "id": "Water_Middle",
        "name": "Water Middle",
        "path": "water/Water_Middle.png",
        "extension": ".png"
      },
      {
        "id": "tile_0198",
        "name": "tile 0198",
        "path": "water/tile_0198.png",
        "extension": ".png"
      },
      {
        "id": "tile_0230",
        "name": "tile 0230",
        "path": "water/tile_0230.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 3
  }
};

// Helper para obtener assets de una carpeta específica
export function getAssetsByFolder(folderName: string): AssetFolder | null {
  return ASSET_MANIFEST[folderName] || null;
}

// Helper para obtener todas las animaciones disponibles
export function getAllAnimations(): AnimationAsset[] {
  const animations: AnimationAsset[] = [];
  
  function collectAnimations(folder: AssetFolder) {
    animations.push(...folder.animations);
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(collectAnimations);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(collectAnimations);
  return animations;
}

// Helper para obtener animaciones por entidad
export function getEntityAnimations(entityName: string): AnimationAsset[] {
  return getAllAnimations().filter(anim => 
    anim.id.includes(entityName) || anim.name.includes(entityName)
  );
}

// Helper para buscar assets por nombre
export function searchAssets(query: string): (AnimationAsset | StaticSpriteAsset)[] {
  const results: (AnimationAsset | StaticSpriteAsset)[] = [];
  const searchTerm = query.toLowerCase();
  
  function searchInFolder(folder: AssetFolder) {
    // Buscar en animaciones
    results.push(...folder.animations.filter(anim => 
      anim.id.toLowerCase().includes(searchTerm) || 
      anim.name.toLowerCase().includes(searchTerm)
    ));
    
    // Buscar en sprites estáticos
    results.push(...folder.staticSprites.filter(sprite => 
      sprite.id.toLowerCase().includes(searchTerm) || 
      sprite.name.toLowerCase().includes(searchTerm)
    ));
    
    // Buscar en subcarpetas
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(searchInFolder);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(searchInFolder);
  return results;
}

// Generar estadísticas de assets
export function getAssetStats() {
  let totalAnimations = 0;
  let totalStaticSprites = 0;
  let totalFolders = 0;
  
  function countAssets(folder: AssetFolder) {
    totalAnimations += folder.animations.length;
    totalStaticSprites += folder.staticSprites.length;
    totalFolders += 1;
    
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(countAssets);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(countAssets);
  
  return {
    totalAnimations,
    totalStaticSprites,
    totalAssets: totalAnimations + totalStaticSprites,
    totalFolders,
    folders: Object.keys(ASSET_MANIFEST)
  };
}
