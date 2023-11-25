import cn from "@src/utils/cn";

const InfoWidget = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex gap-4 items-center duration-300", className)}>
      <div className="flex items-center gap-2">
        <p className="text-4xl font-bold">23&deg;C</p>
        <div className="flex flex-col">
          <p>Amsterdam</p>
          <p>Sunny</p>
        </div>
      </div>
      <div className="flex flex-col">
        <p>Saturday, 25th Feb, 2023</p>
        <p>Week 9</p>
      </div>
    </div>
  );
};

export default InfoWidget;
