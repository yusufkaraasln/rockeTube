import mongoose from "mongoose";
import { NextFunction, Response, Request } from "express";
import redis from "redis";
import Actor from "../models/Actor";

const client = redis.createClient({
    host: "dockerredis",
    port: 6379
});



const createActor = async (req: Request, res: Response, next: NextFunction) => {
    const actor = new Actor({
        name: req.body.name,
        age: req.body.age,
        films: req.body.films,
        photo: req.body.photo
    });

    try {


        const result = await actor.save();
        return res.status(201).json({
            message: "Actor created",
            createdActor: result
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

const readActor = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.actorId;

    try {
        const actor = await Actor.findById(id)
            .populate("films")
            .select("-__v");

        if (actor) {
            return res.status(200).json({
                actor
            });
        } else {
            return res.status(404).json({
                message: "Actor not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }

}

const updateActor = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.actorId;

    try {
        const result = await Actor
            .findByIdAndUpdate(id, {
                $set: req.body
            }, { new: true })
            .populate("films")

        if (result) {
            return res.status(200).json({
                message: "Actor updated",
                updatedActor: result
            });
        }
        else {
            return res.status(404).json({
                message: "Actor not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

const deleteActor = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.actorId;

    try {
        const result = await Actor.findByIdAndDelete(id);






        if (result) {
            return res.status(200).json({
                message: "Actor deleted",
                deletedActor: result
            });
        }
        else {
            return res.status(404).json({
                message: "Actor not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

const readActors = async (req: Request, res: Response, next: NextFunction) => {
    try {

        client.get("actors", async (err, actors) => {
            if (err) console.log(err);
            if (actors) {
                return res.status(200).json({
                    actors: JSON.parse(actors)
                })
            } else {
                const actors = await Actor.find()
                    .populate("films")
                    .select("-__v");
                client.setex("actors", 1800, JSON.stringify(actors))
                return res.status(200).json({
                    actors
                });
            }
        })


    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}


export default {
    createActor,
    readActor,
    updateActor,
    deleteActor,
    readActors
}
