import { MoreThan } from 'typeorm';
import { AppDataSource } from './data-source';
import { Tweet } from './entity/Tweet';
import { User } from './entity/User';

AppDataSource.initialize()
  .then(async (conn) => {
    //await AppDataSource.manager.delete(User, {});

    // const user1 = new User();
    // user1.firstName = 'Timber1';
    // user1.lastName = 'Saw1';
    // user1.age = 25;
    // await AppDataSource.manager.save(user1);

    // const users1 = await conn.manager.find(User);
    // console.log('Loaded users: ', users1);

    //////////////////////////////

    const usersRepository = conn.getRepository(User);
    const tweetsRepository = AppDataSource.getRepository(Tweet);

    await usersRepository.delete({});
    await tweetsRepository.delete({});

    const user2 = usersRepository.create({
      firstName: 'Timber2',
      lastName: 'Saw2',
      age: 26,
    });
    await usersRepository.save(user2).catch((err) => console.log('error', err));

    const tweet1 = new Tweet();
    tweet1.title = 'title 1';
    tweet1.content = 'content 1';
    tweet1.user = user2;

    const tweet2 = new Tweet();
    tweet2.title = 'title 2';
    tweet2.content = 'content 2';
    tweet2.user = user2;

    await tweetsRepository
      .save([tweet1, tweet2])
      .catch((err) => console.log('error', err));

    // const users = await usersRepository.findOne({
    //   select: {
    //     id: true,
    //     firstName: true,
    //     lastName: true,
    //     tweets: true,
    //   },
    //   where: { age: MoreThan(10) },
    //   relations: { tweets: true },
    // });
    // console.log('Loaded users: ', users);

    // const tweets = await tweetsRepository.find();
    // console.log('Loaded tweets: ', tweets);

    const users = await usersRepository.findOne({
      where: { age: MoreThan(10) },
    });
    console.log('Loaded users: ', users);

    console.log('Loaded tweets: ', await users.tweets);
  })
  .catch((error) => console.log(error));
