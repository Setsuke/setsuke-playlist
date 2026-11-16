// Edit artist profiles, shared albums and song rankings here.
// Song titles preserve the exact spelling and capitalization supplied by the owner.
// Albums hold the cover and release year once; songs reference them by albumId.
(function (root) {
  'use strict';
  const collection = {
    "site": {
      "title": "Setsuke’s 25",
      "heading": "SETSUKE’S PLAYLIST",
      "owner": "Sergio Alva",
      "alias": "Setsuke",
      "avatar": "profile/avatar.webp"
    },
    "artists": [
      {
        "id": "empire",
        "name": "EMPiRE",
        "spotify": "https://open.spotify.com/artist/1APhKAeROy02DedkHnbrXb?si=AyJz-rWLTzSIXe0V7fDLVw",
        "image": "posters/empire.webp"
      },
      {
        "id": "exwhyz",
        "name": "ExWHYZ",
        "youtube": "https://www.youtube.com/@ExWHYZ",
        "spotify": "https://open.spotify.com/artist/0xOkccCl0pVdhuLBpcHDJx?si=sH4PeS0MR16yA_ZzpuvZnA",
        "image": "posters/exwhyz.webp"
      },
      {
        "id": "bish",
        "name": "BiSH",
        "youtube": "https://www.youtube.com/@BiSH_official",
        "spotify": "https://open.spotify.com/artist/0ebinq3ZTOQAJNag4sBTJj?si=GL2xkcvtTcOF76hMCbbAyg",
        "image": "posters/bish.webp"
      },
      {
        "id": "lisa",
        "name": "LiSA",
        "youtube": "https://www.youtube.com/@lisaSMEJ",
        "spotify": "https://open.spotify.com/artist/0blbVefuxOGltDBa00dspv?si=57GkCa6qT4iGXY7jKynepQ",
        "image": "posters/lisa.webp"
      },
      {
        "id": "hitsujibungaku",
        "name": "Hitsujibungaku",
        "youtube": "https://www.youtube.com/@hitsujibungaku_official",
        "spotify": "https://open.spotify.com/artist/6S8w5rLsEwjN21jQeRES0n?si=IfGRIDZEQxSjEXgs59ySVA",
        "image": "posters/hitsujibungaku.webp"
      }
    ],
    "albums": [
      {
        "id": "empire-the-great-journey-album",
        "artist": "empire",
        "name": "the GREAT JOURNEY ALBUM",
        "release": "2019",
        "cover": "albums/empire-the-great-journey-album.webp"
      },
      {
        "id": "empire-the-empire-strikes-start",
        "artist": "empire",
        "name": "THE EMPiRE STRiKES START!!",
        "release": "2018",
        "cover": "albums/empire-the-empire-strikes-start.webp"
      },
      {
        "id": "empire-the-final-empire",
        "artist": "empire",
        "name": "THE FiNAL EMPiRE",
        "release": "2022",
        "cover": "albums/empire-the-final-empire.webp"
      },
      {
        "id": "exwhyz-zion",
        "artist": "exwhyz",
        "name": "zION",
        "release": "2026",
        "cover": "albums/exwhyz-zion.webp"
      },
      {
        "id": "exwhyz-xanadu",
        "artist": "exwhyz",
        "name": "xANADU",
        "release": "2023",
        "cover": "albums/exwhyz-xanadu.webp"
      },
      {
        "id": "exwhyz-dress-to-kill",
        "artist": "exwhyz",
        "name": "Dress to Kill",
        "release": "2024",
        "cover": "albums/exwhyz-dress-to-kill.webp"
      },
      {
        "id": "exwhyz-sweet-and-sour",
        "artist": "exwhyz",
        "name": "Sweet & Sour",
        "release": "2024",
        "cover": "albums/exwhyz-sweet-and-sour.webp"
      },
      {
        "id": "bish-killer-bish",
        "artist": "bish",
        "name": "KiLLER BiSH",
        "release": "2016",
        "cover": "albums/bish-killer-bish.webp"
      },
      {
        "id": "bish-the-guerrilla-bish",
        "artist": "bish",
        "name": "THE GUERRiLLA BiSH",
        "release": "2017",
        "cover": "albums/bish-the-guerrilla-bish.webp"
      },
      {
        "id": "bish-letters",
        "artist": "bish",
        "name": "LETTERS",
        "release": "2020",
        "cover": "albums/bish-letters.webp"
      },
      {
        "id": "lisa-launcher",
        "artist": "lisa",
        "name": "Launcher",
        "release": "2015",
        "cover": "albums/lisa-launcher.webp"
      },
      {
        "id": "lisa-little-devil-parade",
        "artist": "lisa",
        "name": "LiTTLE DEViL PARADE",
        "release": "2017",
        "cover": "albums/lisa-little-devil-parade.webp"
      },
      {
        "id": "lisa-leo-nine",
        "artist": "lisa",
        "name": "LEO-NiNE",
        "release": "2020",
        "cover": "albums/lisa-leo-nine.webp"
      },
      {
        "id": "lisa-landspace",
        "artist": "lisa",
        "name": "LANDSPACE",
        "release": "2013",
        "cover": "albums/lisa-landspace.webp"
      },
      {
        "id": "hitsujibungaku-12-hugs-like-butterflies",
        "artist": "hitsujibungaku",
        "name": "12 hugs (like butterflies)",
        "release": "2023",
        "cover": "albums/hitsujibungaku-12-hugs-like-butterflies.webp"
      },
      {
        "id": "hitsujibungaku-our-hope",
        "artist": "hitsujibungaku",
        "name": "our hope",
        "release": "2022",
        "cover": "albums/hitsujibungaku-our-hope.webp"
      },
      {
        "id": "hitsujibungaku-dont-laught-it-off",
        "artist": "hitsujibungaku",
        "name": "Don't Laught It Off",
        "release": "2025",
        "cover": "albums/hitsujibungaku-dont-laught-it-off.webp"
      }
    ],
    "songs": [
      {
        "id": "success-story",
        "title": "SUCCESS STORY",
        "artist": "empire",
        "rank": 1,
        "albumId": "empire-the-great-journey-album"
      },
      {
        "id": "a-journey",
        "title": "A journey",
        "artist": "empire",
        "rank": 2,
        "albumId": "empire-the-great-journey-album"
      },
      {
        "id": "black-to-the-dreamlight",
        "title": "Black to the dreamlight",
        "artist": "empire",
        "rank": 3,
        "albumId": "empire-the-empire-strikes-start"
      },
      {
        "id": "nee",
        "title": "ねぇ",
        "artist": "empire",
        "rank": 4,
        "albumId": "empire-the-final-empire"
      },
      {
        "id": "empire-is-coming",
        "title": "EMPiRE is COMiNG",
        "artist": "empire",
        "rank": 5,
        "albumId": "empire-the-empire-strikes-start"
      },
      {
        "id": "faded",
        "title": "FADED",
        "artist": "exwhyz",
        "rank": 6,
        "albumId": "exwhyz-zion"
      },
      {
        "id": "blaze",
        "title": "BLAZE",
        "artist": "exwhyz",
        "rank": 7,
        "albumId": "exwhyz-xanadu"
      },
      {
        "id": "our-song",
        "title": "Our Song",
        "artist": "exwhyz",
        "rank": 8,
        "albumId": "exwhyz-dress-to-kill"
      },
      {
        "id": "sweet-and-sour",
        "title": "Sweet & Sour",
        "artist": "exwhyz",
        "rank": 9,
        "albumId": "exwhyz-sweet-and-sour"
      },
      {
        "id": "drama",
        "title": "Drama",
        "artist": "exwhyz",
        "rank": 10,
        "albumId": "exwhyz-sweet-and-sour"
      },
      {
        "id": "orchestra",
        "title": "Orchestra",
        "artist": "bish",
        "rank": 11,
        "albumId": "bish-killer-bish"
      },
      {
        "id": "promise-the-star",
        "title": "Promise the star",
        "artist": "bish",
        "rank": 12,
        "albumId": "bish-the-guerrilla-bish"
      },
      {
        "id": "my-landscape",
        "title": "My landscape",
        "artist": "bish",
        "rank": 13,
        "albumId": "bish-the-guerrilla-bish"
      },
      {
        "id": "tomorrow",
        "title": "TOMORROW",
        "artist": "bish",
        "rank": 14,
        "albumId": "bish-letters"
      },
      {
        "id": "my-distinction",
        "title": "My distinction",
        "artist": "bish",
        "rank": 15,
        "albumId": "bish-killer-bish"
      },
      {
        "id": "rising-hope",
        "title": "Rising Hope",
        "artist": "lisa",
        "rank": 16,
        "albumId": "lisa-launcher"
      },
      {
        "id": "catch-the-moment",
        "title": "Catch the Moment",
        "artist": "lisa",
        "rank": 17,
        "albumId": "lisa-little-devil-parade"
      },
      {
        "id": "unlasting",
        "title": "unlasting",
        "artist": "lisa",
        "rank": 18,
        "albumId": "lisa-leo-nine"
      },
      {
        "id": "adamas",
        "title": "ADAMAS",
        "artist": "lisa",
        "rank": 19,
        "albumId": "lisa-leo-nine"
      },
      {
        "id": "crossing-field",
        "title": "crossing field",
        "artist": "lisa",
        "rank": 20,
        "albumId": "lisa-landspace"
      },
      {
        "id": "more-than-words",
        "title": "more than words",
        "artist": "hitsujibungaku",
        "rank": 21,
        "albumId": "hitsujibungaku-12-hugs-like-butterflies"
      },
      {
        "id": "addiction",
        "title": "Addiction",
        "artist": "hitsujibungaku",
        "rank": 22,
        "albumId": "hitsujibungaku-12-hugs-like-butterflies"
      },
      {
        "id": "ooparts",
        "title": "OOPARTS",
        "artist": "hitsujibungaku",
        "rank": 23,
        "albumId": "hitsujibungaku-our-hope"
      },
      {
        "id": "dogs",
        "title": "Dogs",
        "artist": "hitsujibungaku",
        "rank": 24,
        "albumId": "hitsujibungaku-dont-laught-it-off"
      },
      {
        "id": "hikaru-toki",
        "title": "光るとき",
        "artist": "hitsujibungaku",
        "rank": 25,
        "albumId": "hitsujibungaku-our-hope"
      }
    ]
  };
  root.collection = collection;
  if (typeof module !== 'undefined' && module.exports) module.exports = collection;
})(globalThis);
