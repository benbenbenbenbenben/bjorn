const { TestScheduler } = require("jest");
const bjorn = require("./index")

describe("bjorn", () => {
    const p0 = () => true;
    const p1 = () => true;
    const p2 = () => true;

    const p012 = [p0, p1, p2]

    const zero = x => x === 0;

    const seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    test("regular", () => {
        bjorn(seq)(
            [p0, p1, p2, (p0, tail) => {
                expect(p0).toBe(0)
                expect(tail).toStrictEqual(seq.slice(3))
            }]
        )
    })

    bjorn(seq)(
        [...[p0, p1, p2], (p0, tail) => {
            console.log("splat")
            console.log(p0, tail)
        }]
    )

    bjorn(seq)(
        [...p012, (p0, tail) => {
            console.log("splat named")
            console.log(p0, tail)
        }]
    )

    bjorn([0, 0, 0, ...seq])(
        [zero.many, (zero, tail) => {
            console.log("many")
            console.log(zero, tail)
        }]
    )
})