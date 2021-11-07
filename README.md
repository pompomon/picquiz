# PicQuiz
Simple picture quiz web app


## Local installation
- `npm install && npm start` would launch a local instance on 1337 port

## Setup images

### Config.json format

```json
{
    "quizTypes": ["groups", "types"], // Types of quizes, would generate buttons on the first screen
    "groupsImageCount": 5, // Number of images for "groups" quiz type, when doing this quiz one random image from this number would be shown (purely random, no history of already seen ones)
    "groups": { // "groups" quiz answers - `key` is a short label to be put into each image's filename, `value` is a label to be used in the quiz UI
      "f": "Family",
      "w": "Co-workers",
      "p": "Pub",
      "s": "Shcool",
      "o": "Others"
    },
    "typesImageCount": 4,  // Number of images for "groups" quiz type, when doing this quiz one random image from this number would be shown
    "types": { // "groups" quiz answers - `key` is a short label to be put into each image's filename, `value` is a label to be used in the quiz UI
      "b": "Bart",
      "h": "Homer",
      "l": "Lisa",
      "m": "Marge"
    },
    "labels": { // labels configuration, currently only `short` name is used for initial screen buttons
      "types": {
        "long": "Guess name of the Simpsons Family person on the image",
        "short": "Name guess"
      },
      "groups": {
        "long": "Guess group of the Simpsons character on the image",
        "short": "Group guess"
      }
    }
}

```

### Images folder structure

All images have to be placed in `/images/{quiz-type}/` and have `*.png` extension (lower-case is needed because of case-sensitive comparison)

Full path to an image: 
/images/{quiz-type}/{correct answer short label}_{number of an image, starting with 0}.png

Example #1 - for "groups" type quiz the first image with correct answer "w" (Co-workers, in the config above) would have path:

/images/groups/w_0.png

Example #1 - for "types" type quiz the third image with correct answer "h" (Homer, in the config above) would have path:

/images/types/h_2.png

