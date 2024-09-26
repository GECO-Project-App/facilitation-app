interface TextAreaProps {
  title: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  height: string;
}

const TextArea: React.FC<TextAreaProps> = ({title, selectedValue, setSelectedValue, height}) => {
  return (
    <div>
      <div>
        {/* <div className="relative h-[60vh]"> */}
        <div className={`relative h-[${height}]`}>
          <div className="absolute left-0 top-0 w-full rounded-t-3xl border-l-2 border-r-2 border-t-2 border-black bg-amber-50 bg-pink p-2 text-lg font-bold text-black">
            {title}
            <div className="text-xs font-normal text-gray-700">
              What worked well during this exercise?
            </div>
            <div className="text-xs font-normal text-gray-700">What didn't?</div>
          </div>
          <textarea
            className="h-full w-full rounded-3xl border-2 border-black p-1 pt-20 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
            value={selectedValue}
            placeholder="Write your feedback here..."
            onChange={(e) => setSelectedValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TextArea;
