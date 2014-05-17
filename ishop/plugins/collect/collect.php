<?php
/**
 * @brief �ɼ���������
 * @date 2014/1/1 20:21:11
 * @author chendeshan
 */
abstract class collect
{
	//�Ѿ��ɼ������б�ҳ��html����
	protected $listPageHtml = '';

	//�Ѿ��ɼ���������ҳ��html����
	protected $showPageHtml = '';

	/**
	 * @brief ��ȡ�б�ҳ���html����
	 * @param $url string �б�ҳ��url��ַ
	 */
	public function readListPage($url)
	{
		if($this->checkListUrl($url) == false)
		{
			throw new Exception('URL�����Ϲ淶');
			exit;
		}

		if(!$content = file_get_contents($url))
		{
			throw new Exception('û�вɼ����б�ҳ���html����');
		}

		//ת��GBKת��UTF-8
		$this->listPageHtml = iconv('GBK','UTF-8//IGNORE',$content);
	}

	/**
	 * @brief ��ȡ��Ʒ����ҳ������
	 * @param $url string ����ҳ��url
	 */
	public function readShowPage($url)
	{
		if($this->checkShowUrl($url) == false)
		{
			throw new Exception('URL�����Ϲ淶');
			exit;
		}

		$content = file_get_contents($url);

		//ת��GBKת��UTF-8
		$this->showPageHtml = iconv('GBK','UTF-8//IGNORE',$content);
	}

	/**
	 * @brief �����Ʒ�б�url�ĺϷ���
	 * @param $url string
	 * @return boolean
	 */
	abstract public function checkListUrl($url);

	/**
	 * @brief �����Ʒ����url�ĺϷ���
	 * @param $url string
	 * @return boolean
	 */
	abstract public function checkShowUrl($url);

	/**
	 * @brief �ɼ���Ʒ��Ϣ
	 * @return array
	 */
	abstract public function collect();
}