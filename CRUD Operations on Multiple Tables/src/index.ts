import { AppDataSource } from './data-source';
import { Note } from './entity/Note';
import { SharedNote } from './entity/SharedNote';
import { User } from './entity/User';

AppDataSource.initialize()
  .then(async (conn) => {
    // crud single table
    const u1 = await User.create({ username: 'bob' }).save();
    console.log('u1 create', u1);
    console.log(
      'u1 update',
      await User.update({ id: u1.id }, { username: 'tom' })
    );
    console.log(
      'findOne tom',
      await User.findOne({ where: { username: 'tom' } })
    );
    console.log('find tom', await User.find({ where: { username: 'tom' } }));
    console.log('delete tom', await User.delete({ username: 'tom' }));
    console.log('findOneBe tom', await User.findOneBy({ id: u1.id }));

    // crud many to one
    const joe = await User.create({ username: 'joe' }).save();
    const note = await Note.create({ text: 'hello', ownerId: joe.id }).save();
    // all the notes joe created
    const notes = await Note.find({ where: { ownerId: joe.id } });
    console.log('notes', notes);

    // crud many to many
    const tim = await User.create({ username: 'tim' }).save();
    await SharedNote.create({
      senderId: joe.id,
      targetId: tim.id,
      noteId: note.id,
    }).save();

    const notesSharedWithTim = await SharedNote.find({
      where: {
        targetId: tim.id,
      },
      relations: ['note'],
    });
    console.log('notesSharedWithTim', notesSharedWithTim);

    //typeorm relations
    console.log(
      'findOne tim',
      await User.findOne({
        where: { id: tim.id },
        relations: ['notesSharedWithYou.note'],
      })
    );

    const t = await User.findOne({
      where: { id: tim.id },
      relations: ['notesSharedWithYou', 'notesSharedWithYou.note'],
    });
    console.log('findOne tim.notesSharedWithYou', t.notesSharedWithYou);

    console.log(
      'findOne joe',
      await User.findOne({
        where: { id: joe.id },
        relations: ['notesYouShared.note'],
      })
    );

    console.log(
      'findOne joe',
      await User.findOne({
        where: { id: joe.id },
        relations: ['notesYouShared.note', 'notesSharedWithYou.note'],
      })
    );

    // get all notes joe owns or was shared with him
    // in 1 sql query
    console.log(
      'QueryBuilder',
      await conn
        .getRepository(Note)
        .createQueryBuilder('n')
        .leftJoin(SharedNote, 'sn', 'sn."noteId" = n.id')
        .where('n."ownerId" = :ownerId', { ownerId: joe.id })
        .orWhere('sn."targetId" = :ownerId', { ownerId: joe.id })
        .getMany()
    );
  })
  .then(() => process.exit())
  .catch((error) => console.log(error));
