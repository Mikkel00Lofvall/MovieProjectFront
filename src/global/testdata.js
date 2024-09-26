const MovieTest = {
    name:"Hello World",
    frontPageImage:"https://picsum.photos/200/300",
    imagesBlobs: [
        "https://picsum.photos/600/600?random=1",
        "https://picsum.photos/600/600?random=2",
        "https://picsum.photos/600/600?random=3",
        "https://picsum.photos/600/600?random=4",
        "https://picsum.photos/600/600?random=5",
    ],
    key:1,
    trailerLink: "https://www.youtube.com/embed/vKQi3bBA1y8",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    details: {
        releaseDate: "some date",
        rating: "some rating",
        durationInMinutes: 10,
        directedBy: {
          name: "some director"
        },
        studio: "some studio"
    },
}


const ScheduleTest = {
    "id": 1,                   // ScheduleModel ID
    "MovieId": null,             // Foreign key to MovieModel
    "Date": {                  // DateModel (representing the schedule date and time)
      "id": 0,                 // DateModel ID (optional to return)
      "Year": 2024,            // Year of the schedule
      "Month": 9,             // Month of the schedule
      "Day": 25,               // Day of the schedule
      "Hour": 19,              // Hour (24-hour format)
      "Minute": 30,            // Minute
      "Second": 0              // Second
    }
}

const GetMovieAndScheduleByIDTest = {
  movie: {
    name: "awdawd",
    description: "wadawd",
    details: {
      releaseDate: "Wed Oct 02 2024",
      rating: "some rating",
      durationInMinutes: 1,
      directedBy: null,
      studio: "some studio"
    },
    imagesBlobs: [
      {
        data: "some image"
      },
      {
        data: "some image"
      },
      {
        data: "some image"
      }
    ],
    frontPageImage: {
      data: "some image"
    },
    trailerLink: "some link"
  },
  schedule: {
    id: 1,
    date: {
      year: 2024,
      month: 10,
      day: 4,
      hour: 23,
      minute: 42,
      second: 0
    },
    movieID: 1
  },
  hall: {
    id: 1,
    name: "Hall 1",
    seats: 
    [
      {
        id: 1,
        isTaken: false,
        rowName: "A",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 2,
        isTaken: true,
        rowName: "A",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 3,
        isTaken: false,
        rowName: "A",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 4,
        isTaken: false,
        rowName: "A",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 5,
        isTaken: false,
        rowName: "A",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 6,
        isTaken: false,
        rowName: "A",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 7,
        isTaken: false,
        rowName: "A",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 8,
        isTaken: false,
        rowName: "A",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 9,
        isTaken: false,
        rowName: "B",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 10,
        isTaken: false,
        rowName: "B",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 11,
        isTaken: false,
        rowName: "B",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 12,
        isTaken: false,
        rowName: "B",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 13,
        isTaken: false,
        rowName: "B",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 14,
        isTaken: false,
        rowName: "B",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 15,
        isTaken: false,
        rowName: "B",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 16,
        isTaken: false,
        rowName: "B",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 17,
        isTaken: true,
        rowName: "C",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 18,
        isTaken: false,
        rowName: "C",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 19,
        isTaken: false,
        rowName: "C",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 20,
        isTaken: false,
        rowName: "C",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 21,
        isTaken: false,
        rowName: "C",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 22,
        isTaken: false,
        rowName: "C",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 23,
        isTaken: false,
        rowName: "C",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 24,
        isTaken: false,
        rowName: "C",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 25,
        isTaken: true,
        rowName: "D",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 26,
        isTaken: false,
        rowName: "D",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 27,
        isTaken: false,
        rowName: "D",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 28,
        isTaken: false,
        rowName: "D",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 29,
        isTaken: false,
        rowName: "D",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 30,
        isTaken: false,
        rowName: "D",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 31,
        isTaken: false,
        rowName: "D",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 32,
        isTaken: false,
        rowName: "D",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 33,
        isTaken: true,
        rowName: "E",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 34,
        isTaken: false,
        rowName: "E",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 35,
        isTaken: false,
        rowName: "E",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 36,
        isTaken: false,
        rowName: "E",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 37,
        isTaken: false,
        rowName: "E",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 38,
        isTaken: false,
        rowName: "E",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 39,
        isTaken: false,
        rowName: "E",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 40,
        isTaken: false,
        rowName: "E",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 41,
        isTaken: true,
        rowName: "F",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 42,
        isTaken: false,
        rowName: "F",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 43,
        isTaken: false,
        rowName: "F",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 44,
        isTaken: false,
        rowName: "F",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 45,
        isTaken: false,
        rowName: "F",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 46,
        isTaken: false,
        rowName: "F",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 47,
        isTaken: false,
        rowName: "F",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 48,
        isTaken: false,
        rowName: "F",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 49,
        isTaken: false,
        rowName: "G",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 50,
        isTaken: false,
        rowName: "G",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 51,
        isTaken: false,
        rowName: "G",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 52,
        isTaken: false,
        rowName: "G",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 53,
        isTaken: false,
        rowName: "G",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 54,
        isTaken: false,
        rowName: "G",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 55,
        isTaken: false,
        rowName: "G",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 56,
        isTaken: false,
        rowName: "G",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 57,
        isTaken: false,
        rowName: "H",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 58,
        isTaken: false,
        rowName: "H",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 59,
        isTaken: false,
        rowName: "H",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 60,
        isTaken: false,
        rowName: "H",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 61,
        isTaken: false,
        rowName: "H",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 62,
        isTaken: false,
        rowName: "H",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 63,
        isTaken: false,
        rowName: "H",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 64,
        isTaken: true,
        rowName: "H",
        rowNumber: 8,
        hallId: 1
      },
      {
        id: 65,
        isTaken: true,
        rowName: "I",
        rowNumber: 1,
        hallId: 1
      },
      {
        id: 66,
        isTaken: true,
        rowName: "I",
        rowNumber: 2,
        hallId: 1
      },
      {
        id: 67,
        isTaken: true,
        rowName: "I",
        rowNumber: 3,
        hallId: 1
      },
      {
        id: 68,
        isTaken: true,
        rowName: "I",
        rowNumber: 4,
        hallId: 1
      },
      {
        id: 69,
        isTaken: false,
        rowName: "I",
        rowNumber: 5,
        hallId: 1
      },
      {
        id: 70,
        isTaken: true,
        rowName: "I",
        rowNumber: 6,
        hallId: 1
      },
      {
        id: 71,
        isTaken: true,
        rowName: "I",
        rowNumber: 7,
        hallId: 1
      },
      {
        id: 72,
        isTaken: true,
        rowName: "I",
        rowNumber: 8,
        hallId: 1
      }
    ],
    seatsOnRow: 8

  }
};

  


export default { MovieTest, ScheduleTest, GetMovieAndScheduleByIDTest }