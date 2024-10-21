export const formFields = [
  {
    createItem: {
      item: {
        title: "Křestní jméno",
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false
            }
          }
        }
      },
      location: {
        index: 0
      }
    },
  },
  {
    createItem: {
      item: {
        title: "Přijmení",
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false
            }
          }
        }
      },
      location: {
        index: 1
      }
    },
  }, {
    createItem: {
      item: {
        title: "Email",
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false
            }
          }
        }
      },
      location: {
        index: 2
      }
    },
  },
  {
    createItem: {
      item: {
        title: "Datum narození",
        questionItem: {
          question: {
            required: true,
            dateQuestion: {
              includeTime: false,
              includeYear: true
            }
          }
        }
      },
      location: {
        index: 3
      }
    },
  },
  {
    createItem: {
      item: {
        title: "Adresa",
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false
            }
          }
        }
      },
      location: {
        index: 4
      }
    },
  },
  {
    createItem: {
      item: {
        title: "Číslo občanského průkazu",
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false
            }
          }
        }
      },
      location: {
        index: 5
      }
    },
  }]

