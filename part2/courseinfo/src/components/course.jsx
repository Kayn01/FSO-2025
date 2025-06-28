const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => (
  <div>
    {/* <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} /> */}
    {props.parts.map((part) => {
      return <Part key={part.id} part={part} />;
    })}
  </div>
);

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = (props) => <p>total of {props.total} exercises</p>;

const Course = (props) => {
  const total = props.course.parts.reduce((acc, cur) => {
    return acc + cur.exercises;
  }, 0);
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={total} />
    </div>
  );
};

export default Course;
