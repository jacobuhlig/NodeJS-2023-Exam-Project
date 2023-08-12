import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';

import { User, Book, Review, Favorite } from './models/index.js';

async function initializeDatabase() {
  try {
    const passwordAdmin = process.env.ADMIN_PASSWORD;
    const passwordHashAdmin = await bcrypt.hash(passwordAdmin, 12);

    const [userAdmin, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        email: 'admin@example.com',
        password: passwordHashAdmin,
        role: 'admin',
      },
    });

    if (created) {
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // Mock data
    const users = [
      {
        username: 'john',
        email: 'john@example.com',
        password: await bcrypt.hash('john123', 12),
      },
      {
        username: 'mary',
        email: 'mary@example.com',
        password: await bcrypt.hash('mary123', 12),
      },
    ];

    const books = [
      {
        categories: ['Fiction'],
        id: '_6cxEAAAQBAJ',
        title: '1984',
        subtitle: null,
        author: 'George Orwell',
        description:
          'George Orwell is the pen name of the author, Eric Arthur Blair. He was an English essayist, novelist, journalist and critic. His writings are based on social criticism, anti-Fascism, anarchism and support to democratic Socialism. His work remains influential in popular culture and political culture. 1984, a novel, is based on dystopian social science. Its theme is projected on the consequences of mass surveillance, totalitarianism and societal behavior aspect. The author had been a democratic socialist. Mostly, the novel narrates the truth and facts within politics and how come these are manipulated. The author has narrated in on imaginary manner when most of the parts of the world has fallen victim to perpetual war, global mass surveillance, historical nogationism. A huge, propaganda is there. The story reveals that Great Britain, known as Arstri One, has become a province of totalitarian superstate named Okeania. The leader of the party is Big Brother. Actually, its a cult of personality and arises anyone uses the techniques of mass media, social networking, government organised demonstrations and ralies to create an image of a leader. It is often seen in totalitarian or authorisation states. Winston Smith is a protagonist, who is very skillful and outer party member and hates the Party and dreams of rebellion. His relationship with Julia has also come up. 1984 has become a classic literacy example of political and dystopian fiction. Time magazine included this novel on its 100-best English-language novels. Although, Orwell was hesitating for this title but Warbury (the Publisher) suggested this which he took to be a more commercially viable choice. The story behind its title is also very interesting, when Orwell finished this novel in 1948, this title was chosen simply as the inversion of this year. So, at last, in the story, there is a celebration of massive victory of Okeanias over Eurasian armies in Africa. Also, Winston accepted that he loves Big Brother. How this happened? What were the circumstances Winston refused to love Julia? How this political storm took place? For all, the story reveals step by step in an interesting manner. A mind-blowing novel of that time and forever.',
        image:
          'http://books.google.com/books/content?id=_6cxEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        rating: null,
        page_count: 320,
        publisher: 'Diamond Pocket Books Pvt Ltd',
        published_date: '2021-06-05',
      },
      {
        id: 'Lr0UDAAAQBAJ',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        image:
          'http://books.google.com/books/content?id=Lr0UDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      {
        id: 'xjNtEAAAQBAJ',
        title: 'Moby Dick',
        author: 'Herman Melville',
        genre: 'Adventure',
        image:
          'http://books.google.com/books/content?id=xjNtEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      {
        categories: ['Philosophy'],
        id: 'nBcjFHkA9uYC',
        title: 'The Girl with the Dragon Tattoo and Philosophy',
        subtitle: 'Everything Is Fire',
        author: 'Eric Bronson',
        description:
          "The essential companion to Stieg Larsson's bestselling trilogyand director David Fincher's 2011 film adaptation Stieg Larsson's bestselling Millennium Trilogy—The Girlwith the Dragon Tattoo, The Girl Who Played with Fire, andThe Girl Who Kicked the Hornet's Nest—is aninternational phenomenon. These books express Larsson's lifelongwar against injustice, his ethical beliefs, and his deep concernfor women's rights. The Girl with the Dragon Tattoo andPhilosophy probes the compelling philosophical issues behindthe entire trilogy. What philosophies do Lisbeth Salander and Kanthave in common? To catch a criminal, can Lisbeth and Mikael becriminals themselves? Can revenge be ethical? Drawing on some ofhistory's greatest philosophical minds, this book gives freshinsights into Larsson's ingeniously plotted tale of crime andcorruption. Looks at compelling philosophical issues such as a feministreading of Lisbeth Salander, Aristotelian arguments for why we loverevenge, how Kant can explain why so many women sleep with MikaelBlomkvist, and many more Includes a chapter from a colleague of Larsson's—whoworked with him in anti-Nazi activities—that exploresLarsson's philosophical views on skepticism and quotes fromnever-before-seen correspondence with Larsson Offers new insights into the novels' key characters, includingLisbeth Salander and Mikael Blomkvist, and investigates the author,Stieg Larsson As engrossing as the quest to free Lisbeth Salander from herpast, The Girl with the Dragon Tattoo and Philosophy isideal reading for anyone interested in unraveling the subtext andexploring the greater issues at work in the story.",
        image:
          'http://books.google.com/books/content?id=nBcjFHkA9uYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        rating: 5,
        page_count: 240,
        publisher: 'John Wiley & Sons',
        published_date: '2011-09-20',
      },
      {
        categories: ['Fiction'],
        id: 'UbfnTcmkaKkC',
        title: 'The Stand',
        subtitle: null,
        author: 'Stephen King',
        description:
          'The tie-in edition of the nine-part CBS All Access series starring Whoopi Goldberg, Alexander Skarsgard, and James Marsden. When a man escapes from a biological testing facility, he sets in motion a deadly domino effect, spreading a mutated strain of the flu that will wipe out 99 percent of humanity within a few weeks. The survivors who remain are scared, bewildered, and in need of a leader. Two emerge--Mother Abagail, the benevolent 108-year-old woman who urges them to build a peaceful community in Boulder, Colorado; and Randall Flagg, the nefarious "Dark Man," who delights in chaos and violence. As the dark man and the peaceful woman gather power, the survivors will have to choose between them--and ultimately decide the fate of all humanity.',
        image:
          'http://books.google.com/books/content?id=UbfnTcmkaKkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        rating: 4.5,
        page_count: 1200,
        publisher: 'Anchor',
        published_date: '2008-06-24',
      },
      {
        categories: ['Fiction'],
        id: 'vqRkEAAAQBAJ',
        title: 'Animal Farm',
        subtitle: null,
        author: 'George Orwell',
        description:
          'Orwell’s masterpiece! Animal Farm dives deep into the realm of a group of farm animals owned by a cruel and devious farmer. Once the animals rebel against the human tyranny, they create their own society where everyone is supposed to be free and equal. However, the animal-led farm faces it’s own struggles and a dictatorship developes admist their socialist farm of comrades. Napolean, a ferocious hog becomes their leader. Under his rule, are some animals maybe more equal than others?',
        image:
          'http://books.google.com/books/content?id=vqRkEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        rating: 4,
        page_count: 102,
        publisher: 'BoD – Books on Demand',
        published_date: '2022-03-15',
      },
    ];

    for (const user of users) {
      await User.findOrCreate({ where: { email: user.email }, defaults: user });
    }

    for (const book of books) {
      await Book.findOrCreate({ where: { title: book.title }, defaults: book });
    }

    // We'll need to adjust this once we have a relationship established between Users and Books
    const reviews = [
      {
        book_id: 'Lr0UDAAAQBAJ',
        user_id: 2,
        review_text: 'Great book!',
        rating: 5,
      },
      {
        book_id: 'xjNtEAAAQBAJ',
        user_id: 2,
        review_text: 'Very interesting.',
        rating: 4,
      },
    ];

    for (const review of reviews) {
      await Review.findOrCreate({
        where: { user_id: review.user_id, book_id: review.book_id },
        defaults: review,
      });
    }

    const favorites = [
      { book_id: 'Lr0UDAAAQBAJ', user_id: 2 },
      { book_id: 'xjNtEAAAQBAJ', user_id: 2 },
    ];

    for (const favorite of favorites) {
      await Favorite.findOrCreate({
        where: { user_id: favorite.user_id, book_id: favorite.book_id },
        defaults: favorite,
      });
    }

    console.log('Database has been initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
