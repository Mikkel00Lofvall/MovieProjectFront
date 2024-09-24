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



    export default {MovieTest, ScheduleTest}